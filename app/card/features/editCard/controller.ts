import Link from '#card/models/link'
import { HttpContext } from '@adonisjs/core/http'
import { deleteLinkValidator, editCardValidator } from './validator.js'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import sharp from 'sharp'
import { normalizeUrl } from '#utils/normalize_url'
import satori from 'satori'
import { html } from 'satori-html'
import { Resvg } from '@resvg/resvg-js'

export default class EditCardController {
  async deleteLink({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(deleteLinkValidator)
    const user = await auth.authenticate()

    if (user.id === data.userId) {
      await Link.query().where('user_id', data.userId).andWhere('id', data.linkId).delete()
      return response.redirect().toPath(`/${user.username}`)
    }
  }

  async generateOG({
    name,
    avatar,
    banner,
    description,
  }: {
    name: string
    avatar: Buffer<ArrayBufferLike>
    banner: Buffer<ArrayBufferLike>
    description: string
  }) {
    const avatarB64 = 'data:image/png;base64,' + avatar.toString('base64')
    const bannerB64 = 'data:image/png;base64,' + banner.toString('base64')

    const markup = html`<div
      style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%"
    >
      <img
        src="${bannerB64}"
        height="1000"
        width="630"
        style="position: absolute; top: 0; left: 0; width: 1000px; height: 630px; object-fit: cover"
      />

      <div
        style="display: flex; height: 100%; width: 100%; position: absolute; background-color: rgba(0,0,0,0.35);"
      ></div>

      <div
        style="display: flex; align-items: center; gap: 45px; position: absolute; bottom: 40px; left: 40px;"
      >
        <img src="${avatarB64}" height="200" width="200" style="border-radius: 50%" />

        <div style="display: flex; flex-direction: column; color: white; margin-top: 35px">
          <p style="font-size:50px; margin: 0; line-height: 1; font-family: Vollkorn">${name}</p>
          <p
            style="font-size:32px; margin: 0; line-height: 1; font-family: Rethink; margin-top: 6px"
          >
            ${description}
          </p>
        </div>
      </div>
    </div>`

    const svg = await satori(markup, {
      width: 1000,
      height: 630,
      fonts: [
        {
          name: 'Vollkorn',
          data: await this.loadHeadingFont(),
          weight: 400,
          style: 'italic',
        },
        {
          name: 'Rethink',
          data: await this.loadBodyFont(),
          weight: 400,
          style: 'normal',
        },
      ],
    })

    const resvg = new Resvg(svg)
    const png = resvg.render()

    return png.asPng()
  }

  private async loadHeadingFont() {
    const response = await fetch(`${env.get('APP_URL')}/vollkorn.ttf`)
    return await response.arrayBuffer()
  }

  private async loadBodyFont() {
    const response = await fetch(`${env.get('APP_URL')}/rethink.ttf`)
    return await response.arrayBuffer()
  }

  async handle({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(editCardValidator)
    const user = await auth.authenticate()

    if (user.id === data.id) {
      await user
        .merge({
          displayName: data.displayName,
          status: data.status,
          description: data.description,
        })
        .save()

      if (data.links) {
        await Link.createMany(
          data.links.map((link) => ({
            label: link.label,
            url: normalizeUrl(link.url),
            userId: link.userId,
          }))
        )
      }
    }

    if (data.banner && data.details) {
      let { banner, details } = data
      let { width, height, x, y } = details

      const isGif = banner.extname === 'gif'
      const croppedImage = await sharp(banner.tmpPath, {
        animated: isGif,
        pages: isGif ? -1 : undefined,
      })
        .extract({ height, width, left: x, top: y })
        .webp({ quality: 85 })
        .toBuffer()

      const existingBannerKey = user.bannerUrl?.split('/')?.pop()
      let newBannerKey = `${user.username}-banner-${cuid()}.webp`

      await drive.use('s3').put(newBannerKey, croppedImage)
      if (existingBannerKey) await drive.use('s3').delete(existingBannerKey)
      user.bannerUrl = `${env.get('AWS_CDN_URL')}/${newBannerKey}`
      await user.save()
    }

    if (data.avatar && data.details) {
      let { avatar, details } = data
      let { width, height, x, y } = details

      const isGif = avatar.extname === 'gif'
      const croppedImage = await sharp(avatar.tmpPath, {
        animated: isGif,
        pages: isGif ? -1 : undefined,
      })
        .extract({ height, width, left: x, top: y })
        .webp({ quality: 85 })
        .toBuffer()
      const ogImageOptimized = await sharp(avatar.tmpPath)
        .extract({ height, width, left: x, top: y })
        .png({ quality: 85 })
        .toBuffer()
      const ogImageBlurred = await sharp(avatar.tmpPath)
        .extract({ height, width, left: x, top: y })
        .blur(64)
        .png({ quality: 85 })
        .toBuffer()

      if (user.avatarUrl.includes(env.get('AWS_CDN_URL'))) {
        const existingKey = user.avatarUrl.split('/')?.pop()
        const existingMetaImgKey = user.metaImgUrl?.split('/')?.pop()

        if (existingKey) await drive.use('s3').delete(existingKey)
        if (existingMetaImgKey) await drive.use('s3').delete(existingMetaImgKey)
      }

      let newAvatarKey = `${user.username}-avatar-${cuid()}.webp`
      let newMetaImgKey = `${user.username}-meta-${cuid()}.png`

      await drive.use('s3').put(newAvatarKey, croppedImage)
      user.avatarUrl = `${env.get('AWS_CDN_URL')}/${newAvatarKey}`

      let metaImg = await this.generateOG({
        name: user.displayName || user.username!,
        avatar: ogImageOptimized,
        banner: ogImageBlurred,
        description: user.description || '',
      })
      drive.use('s3').put(newMetaImgKey, metaImg)
      user.metaImgUrl = `${env.get('AWS_CDN_URL')}/${newMetaImgKey}`

      await user.save()
    }

    return response.redirect().toPath(`/${user.username}`)
  }
}

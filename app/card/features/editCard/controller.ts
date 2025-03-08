import Link from '#card/models/link'
import { HttpContext } from '@adonisjs/core/http'
import { deleteLinkValidator, editCardValidator } from './validator.js'
import drive from '@adonisjs/drive/services/main'
import { cuid } from '@adonisjs/core/helpers'
import env from '#start/env'
import sharp from 'sharp'
import { normalizeUrl } from '#utils/normalize_url'

export default class EditCardController {
  async deleteLink({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(deleteLinkValidator)
    const user = await auth.authenticate()

    if (user.id === data.userId) {
      await Link.query().where('user_id', data.userId).andWhere('id', data.linkId).delete()
      return response.redirect().toPath(`/${user.username}`)
    }
  }

  async handle({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(editCardValidator)
    console.log(data)
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
      let newBannerKey = `${user.username}-banner-${cuid()}.${banner.extname}`

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

      const existingAvatarKey = user.avatarUrl?.split('/')?.pop()
      let newAvatarKey = `${user.username}-avatar-${cuid()}.${avatar.extname}`

      await drive.use('s3').put(newAvatarKey, croppedImage)
      if (existingAvatarKey) await drive.use('s3').delete(existingAvatarKey)
      user.avatarUrl = `${env.get('AWS_CDN_URL')}/${newAvatarKey}`
      await user.save()
    }

    return response.redirect().toPath(`/${user.username}`)
  }
}

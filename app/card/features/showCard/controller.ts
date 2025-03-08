import User from '#auth/models/user'
import Link from '#card/models/link'
import type { HttpContext } from '@adonisjs/core/http'

export default class ShowCardController {
  async render({ inertia, params, auth }: HttpContext) {
    const user = await User.query().where('username', params.username).first()
    if (!user) return inertia.render('home', { userNotFound: true })

    const links = await Link.query().where('user_id', user!.id)
    await auth.check()

    return inertia.render('user', {
      isOwner: auth.user?.email === user.email,
      user,
      links: links || [],
    })
  }
}

import User from '#auth/models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async githubLogin({ response, auth, ally, inertia }: HttpContext) {
    const gh = ally.use('github')

    if (gh.accessDenied() || gh.stateMisMatch() || gh.hasError()) {
      return inertia.render('auth/signin', {
        error: gh.getError() || 'Authentification failed',
      })
    }

    const githubUser = await gh.user()
    const existingUser = await User.firstOrCreate(
      {
        email: githubUser.email,
      },
      {
        username: githubUser.original.login,
        displayName: githubUser.name,
        avatarUrl: githubUser.avatarUrl,
        bannerUrl: 'images/bmw.gif',
      }
    )

    await auth.use('web').login(existingUser, true)

    return response.redirect().toPath(`/${existingUser.username}`)
  }

  async googleLogin({ ally }: HttpContext) {
    const go = ally.use('google')

    if (go.accessDenied()) {
      return 'You have cancelled the login process'
    }

    if (go.stateMisMatch()) {
      return 'We are unable to verify the request. Please try again'
    }

    if (go.hasError()) {
      return go.getError()
    }

    const user = await go.user()
    return user
  }

  async render({ inertia }: HttpContext) {
    return inertia.render('auth/signin')
  }
}

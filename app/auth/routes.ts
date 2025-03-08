import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const LoginController = () => import('#auth/features/login/controller')

export function registerAuthRoutes() {
  router
    .group(() => {
      router.get('/signin', [LoginController, 'render']).as('pages.signin')
      router.get('/signin/github', ({ ally }) => {
        return ally.use('github').redirect((request) => {
          request.scopes(['user'])
          request.param('allow_signup', false)
        })
      })
      router.get('/signin/google', ({ ally }) => {
        return ally.use('google').redirect((request) => {
          request.scopes(['user'])
          request.param('allow_signup', false)
        })
      })
      router.get('/github/callback', [LoginController, 'githubLogin']).as('social.callback.github')
      router.get('/google/callback', [LoginController, 'googleLogin']).as('social.callback.google')
    })
    .use(middleware.guest())
}

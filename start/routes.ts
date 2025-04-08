/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import User from '#auth/models/user'
import { registerAuthRoutes } from '#auth/routes'
import Link from '#card/models/link'
import { registerCardRoutes } from '#card/routes'
import router from '@adonisjs/core/services/router'

router.get('/', async ({ inertia }) => {
  const user = await User.query().where('username', 'okzmo').first()
  let links: Link[] = []
  if (user) links = await Link.query().where('user_id', user.id)

  return inertia.render('home', { user, links })
})

router.group(() => {
  registerAuthRoutes()
  registerCardRoutes()
})

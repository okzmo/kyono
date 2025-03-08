/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { registerAuthRoutes } from '#auth/routes'
import { registerCardRoutes } from '#card/routes'
import router from '@adonisjs/core/services/router'
router.get('/', ({ inertia }) => inertia.render('home'))

router.group(() => {
  registerAuthRoutes()
  registerCardRoutes()
})

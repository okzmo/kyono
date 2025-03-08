import router from '@adonisjs/core/services/router'
const EditCardController = () => import('#card/features/editCard/controller')
const ShowCardController = () => import('#card/features/showCard/controller')

export function registerCardRoutes() {
  router.group(() => {
    router.get('/:username', [ShowCardController, 'render']).as('pages.usercard')
    router.post('/edit', [EditCardController, 'handle']).as('edit.usercard')
    router.post('/link/delete', [EditCardController, 'deleteLink']).as('link.delete')
  })
}

import { createInertiaApp } from '@inertiajs/svelte'
import { render as svelteRender } from 'svelte/server'

export default function render(page: any) {
  return createInertiaApp({
    page,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.svelte', { eager: true })
      return pages[`../pages/${name}.svelte`]
    },
    setup({ el, App, props }) {
      return svelteRender(App, { props })
    },
  })
}


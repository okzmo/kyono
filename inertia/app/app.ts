/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />
/// <reference types="unplugin-icons/types/svelte" />

import '../css/app.css'
import '@fontsource/vollkorn/400-italic.css'
import '@fontsource/rethink-sans'

import { createInertiaApp } from '@inertiajs/svelte'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { hydrate, mount } from 'svelte'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(`../pages/${name}.svelte`, import.meta.glob('../pages/**/*.svelte'))
  },

  setup({ el, App, props }) {
    if (el.dataset.serverRendered === 'true') {
      hydrate(App, { target: el, props })
    } else {
      mount(App, { target: el, props })
    }
  },
})

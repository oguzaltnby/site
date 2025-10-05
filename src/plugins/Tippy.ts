import { defineNuxtPlugin } from '#app'
import { TippyPlugin } from 'vue-tippy'

import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/shift-away.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(TippyPlugin, {
    directive: 'tippy',
    component: 'Tippy',
    defaultProps: {
      animation: 'shift-away',
      duration: [100, 100],
      hideOnClick: false,
      theme: 'discord',
      inertia: true,
      arrow: true,
    },
  })
})

import CommandMenu from 'vue-cmd-menu'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('CommandMenu', CommandMenu)
})

import { defineNuxtPlugin } from '#app'
import VueDisqus from 'vue3-disqus'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDisqus, {
    shortname: 'oguzaltnby',
  })
})

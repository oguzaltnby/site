// src/plugins/CmdK.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (import.meta.dev) {
    // Geliştirme ortamında dinamik yükle (Vue 2 paketi olsa da lokal dev'de işini görebilir)
    try {
      // Üretimde bundle’a dahil olmasın diye dinamik import ve dev-guard kullandık
      const mod: any = await import(/* @vite-ignore */ 'vue-cmd-menu')
      const CommandMenu = mod.default || mod
      if (CommandMenu) {
        nuxtApp.vueApp.component('CommandMenu', CommandMenu)
        return
      }
    } catch {
      // yüklü değilse no-op’a düş
    }
  }

  // Prod’da veya paket yoksa: no-op component (uygulama kırılmasın)
  nuxtApp.vueApp.component('CommandMenu', {
    name: 'CommandMenu',
    render() { return null }
  })
})

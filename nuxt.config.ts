// nuxt.config.ts
export default defineNuxtConfig({
  // Kaynak dizini
  srcDir: 'src',
  // SSR açık (SSG de desteklenir: nuxi generate)
  ssr: true,

  // Runtime config
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {}
  },

  // Nuxt 3 modülleri
  modules: [
    '@nuxt/image',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vite-pwa/nuxt'
  ],

  // Netlify için uygun Nitro preset
  nitro: {
    preset: 'netlify'
  },

  // Vite: publicDir KULLANMA — Nuxt'ta dir.public kullanılır
  dir: {
    public: 'public' // public/ altındaki dosyalar kökten servis edilir
  },

  // Vite derleme ayarları (mevcut dışlamayı korudum)
  vite: {
    build: {
      rollupOptions: {
        external: ['axios', 'src/static/assets/icons/memoji.png']
      }
    }
  },

  // Opsiyonel örnek ayarlar (gerekirse doldur)
  // image: { },
  robots: {
    // basit bir allow-all
    rules: [{ userAgent: '*', allow: '/' }]
  },
  sitemap: {
    siteUrl: 'https://oguzaltnby.com'
  }
})

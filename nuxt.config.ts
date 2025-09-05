// Types
import type { NuxtConfig } from "@nuxt/types"

// Base config
import buildModules from "./config/buildModules"
import components from "./config/components"
import generate from "./config/generate"
import css from "./config/css"
import head from "./config/head"
import loading from "./config/loading"
import modules from "./config/modules"
import plugins from "./config/plugins"
import publicRuntimeConfig from "./config/publicRuntimeConfig"

// Specific module options
import viteOptions from "./config/modules/vite"
import feed from "./config/modules/feed"

// Constants
const isDev = process.env.NODE_ENV === "development"

const Config: NuxtConfig = {
  rootDir: "./",
  srcDir: "src",
  target: "static",
  ssr: !isDev,

  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    public: {}
  },

  hooks: {
    generate: {
      fallback: true,
      interval: 2000,
      concurrency: 1,
    },
  },

  head,
  loading,
  buildModules,
  components,
  generate,
  css,

  modules: [
    "@nuxt/image-edge",
    // ...modules,
    ...(process.env.NODE_ENV === "production" ? [] : ["better-sqlite3"]),

  ],
  plugins,

  publicRuntimeConfig,

  vite: {
    publicDir: "src/assets",
    ...viteOptions,
    build: {
      rollupOptions: {
        external: ["axios", 'src/static/assets/icons/memoji.png'], // Axios'u harici olarak işaretle
      },
    },
  }
}

export default Config

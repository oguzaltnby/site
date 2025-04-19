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
import feed from "./config/modules/feed"
import path from "path"

// Constants
const isDev = process.env.NODE_ENV === "development"

const Config: NuxtConfig = {
  rootDir: "./",
  srcDir: "src",
  target: "static",
  ssr: !isDev,

  // Webpack 5'i aktif hale getiriyoruz
  build: {
    transpile: ['ofetch'],
    // Webpack 5 kullanımı burada etkinleştiriliyor
    webpack5: true,
  },

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
    "@nuxt/content",
    ...modules,
    "@nuxtjs/feed"
  ],
  feed,
  plugins,
  publicRuntimeConfig,
}

export default Config

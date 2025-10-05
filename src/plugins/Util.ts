// Nuxt 3 plugin
import { defineNuxtPlugin } from '#app'

import getReadableDate from './Utils/getReadableDate'
import getReadingTime from './Utils/getReadingTime'
import getTurkeyTime from './Utils/getTurkeyTime'
import prepareMeta from './Utils/prepareMeta'
import applyMediumZoom from './Utils/applyMediumZoom'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('getReadableDate', getReadableDate)
  nuxtApp.provide('getReadingTime', getReadingTime)
  nuxtApp.provide('getTurkeyTime', getTurkeyTime)
  nuxtApp.provide('prepareMeta', prepareMeta)
  nuxtApp.provide('applyMediumZoom', applyMediumZoom)
})

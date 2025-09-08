import { VMoney } from 'v-money3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('money', VMoney)
})
import { mask } from 'vue-the-mask'

export default defineNuxtPlugin((nuxtApp) => {
  // A diretiva da nova lib se chama 'mask'
  nuxtApp.vueApp.directive('mask', mask)
})

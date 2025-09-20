// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
  ],
  ssr: false,
  devtools: { enabled: true },

  // Configuração para melhor tratamento de erros
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  css: ['~/assets/css/tailwind.css'],

  runtimeConfig: {
    public: {
      backendURL: process.env.BACKEND_URL,
    },
  },

  experimental: {
    payloadExtraction: false, // Previne alguns erros de hidratação
  },
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },
  googleFonts: {
    families: {
      'Montserrat': [400, 500, 600, 700],
      'Open Sans': [400, 500, 600, 700],
    },
    display: 'swap',
  },
})
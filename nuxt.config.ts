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
  ],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  app: {
    baseURL: '/artes-sabores/',
  },

  runtimeConfig: {
    public: {
      backendURL: process.env.BACKEND_URL,
    },
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
      'Montserrat': [400, 500, 600, 700], // pesos que desejar
      'Open Sans': [400, 500, 600, 700],
    },
    display: 'swap',
  },
})

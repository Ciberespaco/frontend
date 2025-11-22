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

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      ignore: ['**/*.ts'],
    },
  ],
  devtools: { enabled: true },

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
    payloadExtraction: false,
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

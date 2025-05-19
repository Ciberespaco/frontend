// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: false,

  runtimeConfig: {
    public: {
      backendURL: process.env.BACKEND_URL,
    },
  },

  modules: [
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
  ],
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      // Cambiar usando variable de entorno en tiempo de ejecución si se necesita
      apiBase: process.env.API_BASE || 'http://localhost:8080'
    }
  }
})

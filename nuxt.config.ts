// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/bootstrap-override.scss'],
  vite: {
    css: {
      preprocessorOptions: {
      }
    }
  },
  app: {
    head: {
      title: 'CITIAPS - Gestor de Tareas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CITIAPS - Aplicación de gestión de tareas con etiquetas personalizadas' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      // Cambiar usando variable de entorno en tiempo de ejecución si se necesita
      apiBase: process.env.API_BASE || 'http://localhost:8080/api'
    }
  }
})

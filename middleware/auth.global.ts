// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/useAuthStore'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  if (!auth.token) {
    auth.initialize()
  }

  const publicPages = ['/login', '/register', '/forgot-password']

  const isPublic = publicPages.includes(to.path)
  const isLoggedIn = !!auth.token

  if (!isLoggedIn && !isPublic) {
    return navigateTo('/login')
  }

  if (isLoggedIn && to.path === '/login') {
    return navigateTo('/')
  }
})

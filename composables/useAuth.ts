import axios from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatError } from '~/lib/utils'

export function useAuth() {
  const auth = useAuthStore()

  const login = async (email: string, password: string) => {
    auth.loading = true
    auth.error = null

    try {
      const { data } = await axios.post('/login', {
        email,
        password,
      })
      auth.setToken(data.access_token)

      const profileRes = await axios.get('/user/me')
      auth.setUser(profileRes.data)

      return true
    }
    catch (err: unknown) {
      auth.error = formatError(err)
      return false
    }
    finally {
      auth.loading = false
    }
  }

  const logout = () => {
    auth.clearAuth()
  }

  return {
    login,
    logout,
    user: computed(() => auth.user),
    token: computed(() => auth.token),
    loading: computed(() => auth.loading),
    error: computed(() => auth.error),
    isLoggedIn: computed(() => !!auth.token),
  }
}

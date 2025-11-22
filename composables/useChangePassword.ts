import { ref } from 'vue'
import axios from 'axios'
import { formatError } from '~/lib/utils'
import { useAuthStore } from '@/stores/useAuthStore'

export function useChangePassword() {
  const loading = ref(false)
  const authStore = useAuthStore()

  const changePassword = async (
    userid: number | number,
    passwords: {
      oldPassword: string
      newPassword: string
      confirmPassword: string
    },
  ) => {
    loading.value = true

    try {
      await axios.post(`/user/change-password/${userId}`, {
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
        confirm_password: passwords.confirmPassword,
      })

      authStore.clearAuth()
    }
    catch (err: unknown) {
      const errorMessage = formatError(err)

      throw new Error(errorMessage)
    }
    finally {
      loading.value = false
    }
  }

  return {
    changePassword,
    loading: computed(() => loading.value),
  }
}

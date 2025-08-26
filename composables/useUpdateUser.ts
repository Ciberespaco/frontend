import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatError } from '~/lib/utils'

export function useUpdateUser() {
  const store = useAuthStore()
  const apiError = ref<string | null>(null)

  const updateUser = async (values: { name: string, email: string }) => {
    apiError.value = null
    try {
      await store.updateUser(values)
    }
    catch (err: unknown) {
      apiError.value = formatError(err)
    }
  }

  return {
    updateUser,
    loading: computed(() => store.loading),
    apiError,
  }
}

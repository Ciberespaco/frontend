import { useRawMaterials } from './useRawMaterials'
import { useArtisansStore } from '#imports'
import { useArtisanTechniques } from './useArtisanTechniques'
import { userProductCategory } from './useProductCategory'
import { formatError } from '~/lib/utils'

export const useProductFormOptions = () => {
  const artisansStore = useArtisansStore()
  const { fetchRawMaterials } = useRawMaterials()
  const { fetchArtisanTechniques } = useArtisanTechniques()
  const { fetchProductCategory } = userProductCategory()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadFormOptions = async () => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        artisansStore.initialize(),
        fetchRawMaterials(),
        fetchArtisanTechniques(),
        fetchProductCategory(),
      ])
    }
    catch (err: unknown) {
      error.value = formatError(err) || 'Falha ao buscar as opções do formulário.'
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    loadFormOptions,
  }
}

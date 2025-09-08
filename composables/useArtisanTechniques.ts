import axios from 'axios'
import { formatError } from '~/lib/utils'
import { useArtisanTechniquesStore } from '~/stores/useArtisanTechniquesStore'
import { storeToRefs } from 'pinia'

export type ArtisanTechnique = {
  id: string
  name: string
}

export const useArtisanTechniques = () => {
  const artisanTechniquesStore = useArtisanTechniquesStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const { artisanTechniques } = storeToRefs(artisanTechniquesStore)
  const fetchError = ref<string | null>(null)

  const fetchArtisanTechniques = async () => {
    if (artisanTechniques.value) {
      return
    }

    loading.value = true
    fetchError.value = null
    try {
      const { data } = await axios.get(`/artisan-techniques`)
      artisanTechniquesStore.setArtisanTechniques(data)
    }
    catch (err: unknown) {
      fetchError.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const createArtisanTechnique = async (data: Omit<ArtisanTechnique, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(`/artisan-techniques`, data)
      artisanTechniquesStore.clearArtisanTechniques()
      await fetchArtisanTechniques()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deleteArtisanTechnique = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/artisan-techniques/${id}`)
      artisanTechniquesStore.clearArtisanTechniques()
      await fetchArtisanTechniques()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchError,
    artisanTechniques,
    createArtisanTechnique,
    fetchArtisanTechniques,
    deleteArtisanTechnique,
  }
}

import axios from 'axios'
import { formatError } from '~/lib/utils'
import { useRawMaterialsStore } from '~/stores/useRawMaterialsStore'

export type RawMaterial = {
  id: string
  name: string
}

export const useRawMaterials = () => {
  const rawMaterialsStore = useRawMaterialsStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const { rawMaterials } = storeToRefs(rawMaterialsStore)
  const fetchError = ref<string | null>(null)

  const fetchRawMaterials = async () => {
    if (rawMaterials.value) {
      return
    }

    loading.value = true
    fetchError.value = null
    try {
      const { data } = await axios.get(`/raw-materials`)
      rawMaterialsStore.setRawMaterials(data)
    }
    catch (err: unknown) {
      fetchError.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const createRawMaterial = async (data: Omit<RawMaterial, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(`/raw-materials`, data)
      rawMaterialsStore.clearRawMaterials()
      await fetchRawMaterials()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deleteRawMaterial = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/raw-materials/${id}`)
      rawMaterialsStore.clearRawMaterials()
      await fetchRawMaterials()
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
    rawMaterials,
    createRawMaterial,
    fetchRawMaterials,
    deleteRawMaterial,
  }
}

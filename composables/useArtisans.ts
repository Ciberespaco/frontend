import { ref, computed } from 'vue'
import axios from 'axios'
import { formatError } from '~/lib/utils'
import type { ArtisanSchema } from '~/lib/schemas/artisan.schema'
import { useArtisansStore } from '~/stores/useArtisansStore'

export type Artisan = {
  id: number
  name: string
  cpf: string
  municipal_seal: string
  sex: 'M' | 'F'
  birthdate: string
  cep: string
  logradouro: string
  house_number: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  artisan_register_date: string
  created_at: string
  exit_date: string | null
  obs: string
  isActive: boolean
}

export interface ArtisanListResponse {
  data: Artisan[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export function useArtisans() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const artisans = ref<Artisan[]>([])
  const totalItems = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalPages = ref(0)
  const artisan = ref<Artisan | null>(null)

  const artisansStore = useArtisansStore()

  const fetchArtisans = async (page: number = 1, limit: number = 10, isActive?: boolean) => {
    loading.value = true
    error.value = null
    try {
      let url = `/artisan/list?page=${page}&limit=${limit}`
      if (isActive !== undefined) {
        url += `&isActive=${isActive}`
      }
      const { data } = await axios.get<ArtisanListResponse>(url)
      // Ensure isActive is calculated for each artisan based on exit_date
      artisans.value = data.data.map(artisan => ({
        ...artisan,
        isActive: artisan.exit_date === null
      }))
      totalItems.value = data.totalItems
      currentPage.value = data.currentPage
      itemsPerPage.value = data.itemsPerPage
      totalPages.value = data.totalPages
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const fetchArtisan = async (id: number | string) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get<Artisan>(`/artisan/${id}`)
      // Ensure isActive is set based on exit_date
      artisan.value = {
        ...data,
        isActive: data.exit_date === null
      }
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const createArtisan = async (data: ArtisanSchema) => {
    loading.value = true
    error.value = null
    try {
      const { data: newArtisan } = await axios.post<Artisan>('/artisan', data)
      artisans.value.push(newArtisan)
      await artisansStore.refresh()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const editArtisan = async (id: number, data: Partial<ArtisanSchema> & { isActive?: boolean }) => {
    loading.value = true
    error.value = null
    try {
      const { data: updatedArtisan } = await axios.put<Artisan>(
        `/artisan/${id}`,
        data,
      )
      artisans.value = artisans.value.map(artisan =>
        artisan.id === id ? updatedArtisan : artisan,
      )
      await artisansStore.refresh()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deleteArtisan = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/artisan/${id}`)
      // Refresh list to update status - fetch all artisans (active and inactive)
      await fetchArtisans(currentPage.value, itemsPerPage.value, undefined)
      await artisansStore.refresh()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const activateArtisan = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await editArtisan(id, { isActive: true })
      // Refresh list to update status - fetch all artisans (active and inactive)
      await fetchArtisans(currentPage.value, itemsPerPage.value, undefined)
      await artisansStore.refresh()
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
    artisans: computed(() => artisans.value),
    artisan: computed(() => artisan.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    totalItems: computed(() => totalItems.value),
    currentPage: computed(() => currentPage.value),
    totalPages: computed(() => totalPages.value),

    createArtisan,
    editArtisan,
    fetchArtisans,
    fetchArtisan,
    deleteArtisan,
    activateArtisan,
  }
}

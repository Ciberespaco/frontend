import { defineStore } from 'pinia'
import axios from 'axios'
import { formatError } from '~/lib/utils'

interface Artisan {
  id: number
  name: string
  cpf: string
  exit_date: string | null
  isActive: boolean
}

interface ArtisansState {
  artisans: Artisan[] | null
  loading: boolean
  error: string | null
}

export const useArtisansStore = defineStore('artisans', {
  state: (): ArtisansState => ({
    artisans: null,
    loading: false,
    error: null,
  }),

  actions: {
    async initialize() {
      if (this.artisans) {
        return
      }

      this.loading = true
      this.error = null
      try {
        const { data: response } = await axios.get<ArtisanListResponse>('/artisan/list')

        const mappedData = response.data.map(artisanFromApi => ({
          id: artisanFromApi.id,
          name: artisanFromApi.name,
          cpf: artisanFromApi.cpf,
          exit_date: artisanFromApi.exit_date,
          isActive: artisanFromApi.isActive,
        }))

        this.artisans = mappedData
      }
      catch (err: unknown) {
        this.error = formatError(err)
        throw err
      }
      finally {
        this.loading = false
      }
    },

    async refresh() {
      this.artisans = null
      await this.initialize()
    },
  },
})

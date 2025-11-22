import { defineStore } from 'pinia'

interface ArtisanTechnique {
  id: number
  name: string
}

export const useArtisanTechniquesStore = defineStore('artisan-techniques', {
  state: (): {
    artisanTechniques: ArtisanTechnique[] | null
  } => ({
    artisanTechniques: null,
  }),

  actions: {
    setArtisanTechniques(data: ArtisanTechnique[]) {
      this.artisanTechniques = data
    },

    clearArtisanTechniques() {
      this.artisanTechniques = null
    },
  },
})

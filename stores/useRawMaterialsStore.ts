import { defineStore } from 'pinia'

interface RawMaterial {
  id: number
  name: string
}

export const useRawMaterialsStore = defineStore('raw-materials', {
  state: (): {
    rawMaterials: RawMaterial[] | null
  } => ({
    rawMaterials: null,
  }),

  actions: {
    setRawMaterials(data: RawMaterial[]) {
      this.rawMaterials = data
    },

    clearRawMaterials() {
      this.rawMaterials = []
    },
  },
})

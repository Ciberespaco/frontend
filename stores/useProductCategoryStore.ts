import { defineStore } from 'pinia'

interface Category {
  id: string
  name: string
}

export const useProductCategoryStore = defineStore('product-categories', {
  state: (): {
    categories: Category[] | null
  } => ({
    categories: null,
  }),

  actions: {
    setCategories(data: Category[]) {
      this.categories = data
    },
    clearCategories() {
      this.categories = []
    },
  },
})

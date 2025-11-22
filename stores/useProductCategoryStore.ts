import { defineStore } from 'pinia'

interface ProductCategory {
  id: number
  name: string
}

export const useProductCategoryStore = defineStore('product-categories', {
  state: (): {
    productCategories: ProductCategory[] | null
  } => ({
    productCategories: null,
  }),

  actions: {
    setCategories(data: ProductCategory[]) {
      this.productCategories = data
    },
    clearCategories() {
      this.productCategories = []
    },
  },
})

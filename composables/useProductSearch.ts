import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'

export interface ProductSearched {
  id: number
  name: string
  quant: number
  artisan: {
    name: string
  }
  price: number
}

export interface ProductApiResponse {
  data: ProductSearched[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export const useProductSearch = (searchTerm: Ref<string>) => {
  const products = ref<ProductSearched[]>([])
  const pending = ref(false)
  const error = ref<Error | null>(null)

  const fetchProducts = async () => {
    if (!searchTerm.value) {
      products.value = []
      return
    }

    pending.value = true
    error.value = null
    try {
      const params = {
        limit: 10,
        status: 'ACTIVE',
        name: searchTerm.value,
      }

      const response = await axios.get<ProductApiResponse>('/products', { params })
      products.value = response.data.data
    }
    catch (err) {
      error.value = err as Error
      products.value = []
    }
    finally {
      pending.value = false
    }
  }

  watch(searchTerm, () => {
    fetchProducts()
  })

  return { data: products, pending, error }
}

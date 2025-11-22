import axios from 'axios'
import { formatError } from '~/lib/utils'
import { useProductCategoryStore } from '~/stores/useProductCategoryStore'

export type ProductCategory = {
  id: number
  name: string
}

export const userProductCategory = () => {
  const productCategoryStore = useProductCategoryStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const { productCategories } = storeToRefs(productCategoryStore)
  const fetchError = ref<string | null>(null)

  const fetchProductCategory = async () => {
    loading.value = true
    fetchError.value = null
    try {
      const { data } = await axios.get(`/product-category`)
      productCategoryStore.setCategories(data)
    }
    catch (err: unknown) {
      fetchError.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const createProductCategory = async (data: Omit<ProductCategory, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      await axios.post(`/product-category`, data)
      productCategoryStore.clearCategories()
      await fetchProductCategory()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const updateProductCategory = async (id: number, data: Omit<ProductCategory, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      await axios.patch(`/product-category/${id}`, data)
      productCategoryStore.clearCategories()
      await fetchProductCategory()
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deleteProductCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/product-category/${id}`)
      productCategoryStore.clearCategories()
      await fetchProductCategory()
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
    productCategories,
    createProductCategory,
    fetchProductCategory,
    updateProductCategory,
    deleteProductCategory,
  }
}

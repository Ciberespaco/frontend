import axios from 'axios'
import { formatError } from '~/lib/utils'

export type ProductCategory = {
  id: string
  name: string
}

export const userProductCategory = () => {
  const productCategoryStore = useProductCategoryStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const productCategory = storeToRefs(productCategoryStore)
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

  const deleteProductCategory = async (id: string) => {
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
    productCategory,
    createProductCategory,
    fetchProductCategory,
    deleteProductCategory,
  }
}

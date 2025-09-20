import axios from 'axios'
import type { ProductSchema } from '~/lib/schemas/product.schema'
import { formatError } from '~/lib/utils'

export type Product = {
  id: string
  artisan: {
    id: string
    name: string
    cpf: string
    municipal_seal: string
  }
  product_code: number
  barcode: string
  name: string
  price: number
  quant: number
  obs?: string | null
  status: string
  created_at: string
  updated_at: string
  raw_material: {
    id: string
    name: string
  }
  artisanal_technique: {
    id: string
    name: string
  }
  product_category: {
    id: string
    name: string
  }
}

interface ProductListResponse {
  data: Product[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

export function useProducts() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const products = ref<Product[]>([])
  const totalItems = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalPages = ref(0)
  const product = ref<Product | null>(null)

  const fetchProducts = async (page: number = 1, limit: number = 10) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get<ProductListResponse>(
        `/products?page=${page}&limit=${limit}`,
      )
      products.value = data.data
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

  const fetchProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get<Product>(`/products/${id}`)
      product.value = data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw formatError(err)
    }
    finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete<Product>(`/products/${id}`)
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw formatError(err)
    }
    finally {
      loading.value = false
    }
  }

  const createProduct = async (data: ProductSchema) => {
    loading.value = true
    error.value = null
    try {
      await axios.post<ProductSchema>('/products', data)
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw formatError(err)
    }
    finally {
      loading.value = false
      fetchProducts()
    }
  }

  const editProduct = async (data: ProductSchema, id: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.patch<ProductSchema>(`/products/${id}`, data)
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw formatError(err)
    }
    finally {
      loading.value = false
      fetchProduct(id)
    }
  }

  const searchProductByName = async (name: string, limit = 5): Promise<Product[]> => {
    if (!name || name.length < 2) {
      return Promise.resolve([])
    }

    loading.value = true
    error.value = null

    try {
      const { data } = await axios.get<ProductListResponse>(`/products?limit=${limit}&name=${name}`)
      return data.data
    } catch (err: unknown) {
      error.value = formatError(err)
      console.error("Error searching products:", err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    products,
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    fetchProducts,
    fetchProduct,
    createProduct,
    editProduct,
    deleteProduct,
    product,
    searchProductByName,
  }
}

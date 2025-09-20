import axios from 'axios'
import { formatError } from '~/lib/utils'
import { usePdvStore } from '#imports'

export type CreateSalePayload = {
  quant: number
  total: number
  payment_methods_ids: string[]
  products_sales: ProductSale[]
}

export type ProductSale = {
  product_id: string
  quant: number
  total: number
}

export type ProductSaleDetail = {
  id: string
  product_id: string
  sale_id: string
  quant: number
  total: number
}

export type SaleResponse = {
  id: string
  date: string
  quant: number
  total: number
  status: boolean
  user_id: string
  products_sales: ProductSaleDetail[]
}

export const useSales = () => {
  const pdvStore = usePdvStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sales = ref<SaleResponse[]>([])

  const createSale = async () => {
    loading.value = true
    error.value = null
    if (!pdvStore.canFinalizeSale) {
      error.value = 'Ainda não é possível finalizar a venda.'
      loading.value = false
      return
    }

    const payload: CreateSalePayload = {
      quant: 1,
      total: pdvStore.total,
      payment_methods_ids: [pdvStore.selectedPaymentMethod!],
      products_sales: pdvStore.items.map(item => ({
        product_id: item.productId,
        quant: item.quantidade,
        total: item.subtotal,
      })),
    }

    try {
      await axios.post(`/sales`, payload)
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const fetchSales = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/sales`)
      sales.value = response.data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const fetchSale = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/sales/` + id)
      return response.data as SaleResponse
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deleteSale = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/sales/` + id)
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
    fetchSales,
    sales,
    createSale,
    deleteSale,
    fetchSale,
    loading,
    error,
  }
}

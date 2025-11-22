import { ref } from 'vue'
import axios from 'axios'
import { formatError } from '~/lib/utils'
import type { PaymentMethodFormValues } from '~/lib/schemas/payment-method.schema'

export interface PaymentMethod {
  id: number
  name: string
  fee: number
}

export function usePaymentMethods() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentMethods = ref<PaymentMethod[]>([])
  const paymentMethod = ref<PaymentMethod | null>(null)

  const fetchPaymentMethods = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get<PaymentMethod[]>('/payment-methods')
      paymentMethods.value = data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const fetchPaymentMethod = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get<PaymentMethod>(`/payment-methods/${id}`)
      paymentMethod.value = data
      return data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const createPaymentMethod = async (formData: PaymentMethodFormValues) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.post<PaymentMethod>('/payment-methods', formData)
      await fetchPaymentMethods()
      return data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const updatePaymentMethod = async (id: number, formData: PaymentMethodFormValues) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.put<PaymentMethod>(`/payment-methods/${id}`, formData)
      await fetchPaymentMethods()
      return data
    }
    catch (err: unknown) {
      error.value = formatError(err)
      throw err
    }
    finally {
      loading.value = false
    }
  }

  const deletePaymentMethod = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`/payment-methods/${id}`)
      await fetchPaymentMethods()
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
    paymentMethods,
    paymentMethod,
    fetchPaymentMethods,
    fetchPaymentMethod,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
  }
}

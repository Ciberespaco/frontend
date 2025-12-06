import { defineStore } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import type { z } from 'zod'
import type { SaleItemSchema } from '~/lib/schemas/create-sale.schema'

export interface SaleItem {
  id: string
  productid: number
  codigo: number
  produto: string
  quantidade: number
  valorUnitario: number
  artesao?: { name: string }
  desconto: number
  subtotal: number
}

type FormData = z.infer<typeof SaleItemSchema>

export const usePdvStore = defineStore('pdv', () => {
  const items = ref<SaleItem[]>([])
  const selectedPaymentMethod = ref<string | null>(null)

  const total = computed(() => {
    return items.value.reduce((acc, item) => acc + item.subtotal, 0)
  })

  const totalDiscount = computed(() => {
    return items.value.reduce((acc, item) => acc + item.desconto, 0)
  })

  const totalBeforeDiscount = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.valorUnitario * item.quantidade), 0)
  })

  const canFinalizeSale = computed(() => {
    return items.value.length > 0 && !!selectedPaymentMethod.value
  })

  // Persistence
  watch(
    [items, selectedPaymentMethod],
    () => {
      localStorage.setItem('pdv_items', JSON.stringify(items.value))
      if (selectedPaymentMethod.value) {
        localStorage.setItem('pdv_payment_method', selectedPaymentMethod.value)
      }
      else {
        localStorage.removeItem('pdv_payment_method')
      }
    },
    { deep: true },
  )

  onMounted(() => {
    const savedItems = localStorage.getItem('pdv_items')
    const savedPaymentMethod = localStorage.getItem('pdv_payment_method')

    if (savedItems) {
      try {
        items.value = JSON.parse(savedItems)
      }
      catch (e) {
        console.error('Failed to parse saved PDV items', e)
      }
    }

    if (savedPaymentMethod) {
      selectedPaymentMethod.value = savedPaymentMethod
    }
  })

  function addItem(formData: FormData) {
    const { product, quantity, discount = 0 } = formData
    if (!product || !product.id) {
      return
    }

    const newItem: SaleItem = {
      id: crypto.randomUUID(),
      productid: Number(product.id),
      codigo: product.product_code || 0,
      produto: product.name,
      quantidade: quantity,
      valorUnitario: product.price,
      artesao: product.artisan,
      desconto: discount,
      subtotal: (product.price * quantity) - discount,
    }
    items.value.push(newItem)
  }

  function clearSale() {
    items.value = []
    selectedPaymentMethod.value = null
    localStorage.removeItem('pdv_items')
    localStorage.removeItem('pdv_payment_method')
  }

  function removeItem(itemId: string) {
    const index = items.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  return {
    items,
    total,
    selectedPaymentMethod,
    canFinalizeSale,
    addItem,
    removeItem,
    clearSale,
    totalDiscount,
    totalBeforeDiscount,
  }
})

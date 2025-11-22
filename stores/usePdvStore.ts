import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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

<template>
  <div
    v-if="loading"
    class="flex items-center justify-center py-12"
  >
    <div class="flex items-center gap-3">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span class="text-gray-600">Carregando...</span>
    </div>
  </div>

  <div
    v-else-if="sale"
    class="space-y-6"
  >
    <div class="flex justify-end gap-3 mb-8">
      <Button
        variant="destructive"
        size="sm"
        class="flex items-center gap-2"
        @click="handleDelete"
      >
        <Trash2 class="h-4 w-4" />
        Excluir
      </Button>
    </div>
    <InfoCard
      title="Informações do Pedido"
      :icon="FileText"
    >
      <InfoItem
        label="ID do Pedido"
        :value="sale.id"
        mono
      />
      <InfoItem
        label="Data"
        :value="formatDate(sale.date)"
      />
      <InfoItem
        label="Total do Pedido"
        :value="formatCurrency(sale.total / 100)"
      />

      <InfoItem
        label="ID do Usuário"
        :value="sale.user_id"
        mono
      />
      <InfoItem
        label="Nome do Usuário"
        :value="userName || `ID: ${sale.user_id}`"
      />
      <InfoItem
        v-if="paymentMethodName"
        label="Método de Pagamento"
        :value="paymentMethodName"
      />
      <InfoItem
        label="Status"
        variant="badge"
      >
        <Badge :variant="sale.status ? 'default' : 'destructive'">
          {{ sale.status ? "Finalizada" : "Pendente" }}
        </Badge>
      </InfoItem>
    </InfoCard>

    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Package class="h-5 w-5" />
          Produtos do Pedido ({{ sale.products_sales.length }})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="product in sale.products_sales"
            :key="product.id"
            class="p-3 border rounded-md"
          >
            <p class="font-medium text-gray-900 mb-2">
              {{ productNames[product.product_id] || `Produto #${product.product_id}` }}
            </p>
            <div class="flex justify-between items-center">
              <span class="text-gray-800">
                Quantidade: <strong>{{ product.quant }}</strong>
              </span>
              <span class="font-semibold text-gray-900">
                Subtotal: {{ formatCurrency(product.total / 100) }}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <div
    v-else
    class="text-center py-12"
  >
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle class="h-12 w-12 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Pedido não encontrado
    </h3>
    <p class="text-gray-600">
      {{ emptyMessage || "Não foi possível encontrar os dados do pedido solicitado." }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import { FileText, Package, AlertCircle, Trash2 } from 'lucide-vue-next'
import axios from 'axios'

import { useSales, type SaleResponse } from '@/composables/useSales'
import { useProducts } from '@/composables/useProducts'
import { usePaymentMethods, type PaymentMethod } from '@/composables/usePaymentMethods'
import { useAuth } from '@/composables/useAuth'
import { formatDate, formatCurrency } from '~/lib/utils'
import InfoCard from '../InfoCard/InfoCard.vue'
import InfoItem from '../InfoCard/InfoItem.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showErrorAlert, showSuccessToast } from '~/lib/swal'
import Button from '../ui/button/Button.vue'

defineProps<{
  emptyMessage?: string
}>()

const route = useRoute()
const { fetchSale, deleteSale, loading, error } = useSales()
const { fetchProduct } = useProducts()
const { fetchPaymentMethod } = usePaymentMethods()

const sale = ref<SaleResponse | null>(null)
const productNames = ref<Record<number, string>>({})
const userName = ref<string>('')
const paymentMethodName = ref<string>('')

onMounted(async () => {
  const saleId = route.params.id as string

  if (!saleId) {
    Swal.fire({
      icon: 'error',
      title: 'Erro de Rota',
      text: 'O ID do pedido não foi fornecido na URL.',
    })
    return
  }

  try {
    const saleData = await fetchSale(saleId)
    sale.value = saleData

    // Fetch user name
    if (saleData.user_id) {
      const { user } = useAuth()
      
      if (user.value && user.value.id === saleData.user_id) {
        userName.value = user.value.name
      } else {
        try {
          const { data: fetchedUser } = await axios.get(`/user/${saleData.user_id}`)
          userName.value = fetchedUser.name
        } catch (e) {
          console.error('Erro ao buscar usuário:', e)
          userName.value = `Usuário #${saleData.user_id}`
        }
      }
    }

    // Fetch payment method
    // Assuming the backend returns payment_methods_ids or similar, or we try to fetch it if available.
    // Since it's not in the type, we check if it exists on the object (it might be untyped).
    // If not, we can't display it easily without backend changes.
    // However, based on createSale, it sends payment_methods_ids.
    // Let's try to access it as any.
    const saleAny = saleData as any
    if (saleAny.payment_methods_ids && saleAny.payment_methods_ids.length > 0) {
      try {
        const method = await fetchPaymentMethod(saleAny.payment_methods_ids[0])
        if (method) {
          paymentMethodName.value = method.name
        }
      } catch (e) {
        console.error('Erro ao buscar método de pagamento:', e)
        paymentMethodName.value = 'Método não encontrado'
      }
    } else if (saleAny.payment_methods && saleAny.payment_methods.length > 0) {
       // Fallback if backend returns full objects
       paymentMethodName.value = saleAny.payment_methods[0].name
    }

    // Fetch product names
    if (saleData && saleData.products_sales) {
      const promises = saleData.products_sales.map(async (item) => {
        try {
           await getProductName(item.product_id)
        } catch (e) {
          console.error(e)
        }
      })
      await Promise.all(promises)
    }
  }
  catch (err) {
    const errMessage = String(error.value) || String(err) || 'Erro ao buscar os dados do pedido. Tente novamente.'
    showErrorAlert(errMessage)
  }
})

// Helper to fetch product name safely
const getProductName = async (id: number) => {
  if (productNames.value[id]) return
  try {
    const { fetchProduct, product } = useProducts() 
    await fetchProduct(id)
    if (product.value) {
      productNames.value[id] = product.value.name
    }
  } catch (e) {
    productNames.value[id] = 'Produto não encontrado'
  }
}

// Watch sale to fetch names
watch(sale, async (newSale) => {
  if (newSale?.products_sales) {
    for (const item of newSale.products_sales) {
      await getProductName(item.product_id)
    }
  }
})

const handleDelete = async () => {
  if (!sale.value) return
  const result = await Swal.fire({
    title: 'Tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sim, excluir!',
    cancelButtonText: 'Cancelar',
  })
  if (!result.isConfirmed) {
    return
  }
  try {
    await deleteSale(sale.value.id)
    showSuccessToast('Pedido excluído com sucesso!')
    useRouter().push('/sales')
  }
  catch (err) {
    const errMessage = String(error.value) || String(err) || 'Erro ao excluir o pedido. Tente novamente.'
    showErrorAlert(errMessage)
  }
}
</script>

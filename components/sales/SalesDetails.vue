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
      title="Informações da Venda"
      :icon="FileText"
    >
      <InfoItem
        label="ID da Venda"
        :value="sale.id"
        mono
      />
      <InfoItem
        label="Data"
        :value="formatDate(sale.date)"
      />
      <InfoItem
        label="Total da Venda"
        :value="formatCurrency(sale.total / 100)"
      />
      <InfoItem
        label="ID do Usuário"
        :value="sale.user_id"
        mono
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
          Produtos Vendidos ({{ sale.products_sales.length }})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="product in sale.products_sales"
            :key="product.id"
            class="p-3 border rounded-md"
          >
            <p class="font-mono text-sm text-gray-600 mb-2">
              ID do Produto: {{ product.product_id }}
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
      Venda não encontrada
    </h3>
    <p class="text-gray-600">
      {{ emptyMessage || "Não foi possível encontrar os dados da venda solicitada." }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { FileText, Package, AlertCircle, Trash2 } from 'lucide-vue-next'

import { useSales, type SaleResponse } from '@/composables/useSales'
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

const sale = ref<SaleResponse | null>(null)

onMounted(async () => {
  const saleId = route.params.id as string

  if (!saleId) {
    Swal.fire({
      icon: 'error',
      title: 'Erro de Rota',
      text: 'O ID da venda não foi fornecido na URL.',
    })
    return
  }

  try {
    const saleData = await fetchSale(saleId)
    sale.value = saleData
  }
  catch (err) {
    const errMessage = String(error.value) || String(err) || 'Erro ao buscar os dados da venda. Tente novamente.'
    showErrorAlert(errMessage)
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
    showSuccessToast('Venda excluída com sucesso!')
    useRouter().push('/sales')
  }
  catch (err) {
    const errMessage = String(error.value) || String(err) || 'Erro ao excluir a venda. Tente novamente.'
    showErrorAlert(errMessage)
  }
}
</script>

<template>
  <div class="flex gap-3 mb-8">
    <ProductEditModal v-if="product" :product="product" />
    <Button variant="destructive" size="sm" class="flex items-center gap-2" @click="handleDelete">
      <Trash2 class="h-4 w-4" />
      Excluir
    </Button>
  </div>

  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="flex items-center gap-3">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span class="text-gray-600">Carregando...</span>
    </div>
  </div>

  <div v-else-if="product" class="space-y-6">
    <InfoCard title="Informações do Produto" :icon="Package">
      <InfoItem label="Nome do Produto" :value="product.name" />
      <InfoItem label="Código do Produto" :value="String(product.product_code)" mono />
      <InfoItem label="Código de Barras" :value="product.barcode" mono />
      <InfoItem label="Status" variant="badge">
        <Badge :variant="product.status === 'ACTIVE' ? 'default' : 'destructive'">
          {{ product.status === "ACTIVE" ? "Ativo" : "Inativo" }}
        </Badge>
      </InfoItem>
    </InfoCard>

    <InfoCard title="Preço e Estoque" :icon="CircleDollarSign">
      <InfoItem label="Preço" :value="formatCurrency(product.price)" />
      <InfoItem label="Quantidade em Estoque" :value="`${product.quant} unidades`" />
    </InfoCard>

    <InfoCard title="Classificação" :icon="Tags">
      <InfoItem label="Categoria" :value="product.product_category.name" />
      <InfoItem label="Matéria-Prima" :value="product.raw_material.name" />
      <InfoItem label="Técnica Artesanal" :value="product.artisanal_technique.name" />
    </InfoCard>

    <InfoCard title="Artesão Responsável" :icon="User">
      <InfoItem label="Id" :value="product.artisan.id" mono />
      <InfoItem label="Nome" :value="product.artisan.name" />
      <InfoItem label="cpf" :value="formatCpf(product.artisan.cpf)" />
      <InfoItem label="selo municipal" :value="product.artisan.municipal_seal" />
    </InfoCard>

    <InfoCard title="Informações do Registro" :icon="FileText">
      <InfoItem label="Data de Criação" :value="formatDateTime(product.created_at)" />
      <InfoItem label="Última Atualização" :value="formatDateTime(product.updated_at)" />
    </InfoCard>

    <Card v-if="product.obs">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <MessageSquare class="h-5 w-5" />
          Observações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-gray-900 leading-relaxed">
          {{ product.obs }}
        </p>
      </CardContent>
    </Card>
  </div>

  <div v-else class="text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle class="h-12 w-12 text-gray-400" />
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">
      Nenhum produto encontrado
    </h3>
    <p class="text-gray-600">
      {{ emptyMessage || "Não foi possível encontrar os dados do produto solicitado." }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'
import { Button } from '@/components/ui/button'
import {
  Trash2,
  User,
  Package,
  FileText,
  MessageSquare,
  AlertCircle,
  Tags,
  CircleDollarSign,
} from 'lucide-vue-next'
import { formatCpf, formatDateTime, formatCurrency } from '~/lib/utils' // Adicione formatCurrency
import InfoCard from '../InfoCard/InfoCard.vue'
import InfoItem from '../InfoCard/InfoItem.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { showConfirmDialog, ShowCrudErrorAlert, showSuccessToast } from '~/lib/swal'
import ProductEditModal from './ProductEditModal.vue'

defineProps<{
  emptyMessage?: string
}>()

const route = useRoute()
const router = useRouter()

const { product, loading, fetchProduct, deleteProduct } = useProducts()

onMounted(() => {
  const productId = route.params.id as string
  if (productId) {
    fetchProduct(productId)
  }
})

const handleDelete = async () => {
  const productId = route.params.id as string
  if (!productId) return

  const result = await showConfirmDialog({
    title: 'Você tem certeza?',
    text: "Você não poderá reverter esta ação!",
    confirmButtonText: 'Sim, excluir!',
  })

  if (!result) {
    return
  }

  try {
    await deleteProduct(productId)
    showSuccessToast('Produto excluído com sucesso!')
    router.push('/products')
  } catch (err: unknown) {
    ShowCrudErrorAlert("produto", "excluir", String(err))
  }
}
</script>
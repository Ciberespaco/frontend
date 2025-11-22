<script lang="ts" setup>
import DataTable from '@/components/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/table-core'
import { formatCurrency, formatDate } from '~/lib/utils'
import { useProducts, type Product } from '~/composables/useProducts'
import { NuxtLink } from '#components'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XCircle, CheckCircle, Pencil } from 'lucide-vue-next'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'
import ProductEditModal from './ProductEditModal.vue'

const {
  fetchProducts,
  error,
  loading,
  totalItems,
  currentPage,
  totalPages,
  products,
  deleteProduct,
  activateProduct,
} = useProducts()

onMounted(() => {
  fetchProducts(undefined, undefined, undefined)
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchProducts(currentPage.value)
}

const handleDeactivate = async (id: number) => {
  const confirmed = await showConfirmDialog({
    title: 'Tem certeza?',
    text: 'O produto será desativado.',
    confirmButtonText: 'Sim, desativar!',
  })
  if (confirmed) {
    try {
      await deleteProduct(id)
      showSuccessToast('Produto desativado com sucesso!')
      refresh()
    }
    catch (err: unknown) {
      ShowCrudErrorAlert('produto', 'desativar', String(err))
    }
  }
}

const handleActivate = async (id: number) => {
  const confirmed = await showConfirmDialog({
    title: 'Tem certeza?',
    text: 'O produto será ativado.',
    confirmButtonText: 'Sim, ativar!',
    confirmButtonColor: '#16a34a',
  })
  if (confirmed) {
    try {
      await activateProduct(id)
      showSuccessToast('Produto ativado com sucesso!')
      refresh()
    }
    catch (err: unknown) {
      ShowCrudErrorAlert('produto', 'ativar', String(err))
    }
  }
}

const columns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: 'product_code',
    header: 'Código',
  },
  {
    accessorKey: 'name',
    header: 'Nome do Produto',
  },
  {
    accessorKey: 'artisan',
    header: 'Artesão',
    cell: ({ row }) => {
      const artisan: { id: string, name: string } = row.getValue('artisan')
      if (!artisan) return null

      return h(
        NuxtLink,
        { to: `/artisans/${artisan.id}`, class: 'text-blue-600 hover:underline' },
        () => artisan.name,
      )
    },
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => formatCurrency(Number(row.getValue('price')) / 100),
  },
  {
    accessorKey: 'quant',
    header: 'Quantidade',
  },
  {
    accessorKey: 'product_category',
    header: 'Categoria',
    cell: ({ row }) => {
      const category: { name: string } = row.getValue('product_category')
      return category.name
    },
  },
  {
    accessorKey: 'raw_material',
    header: 'Matéria-Prima',
    cell: ({ row }) => {
      const material: { name: string } = row.getValue('raw_material')
      return material.name
    },
  },
  {
    accessorKey: 'artisanal_technique',
    header: 'Técnica Artesanal',
    cell: ({ row }) => {
      const technique: { name: string } = row.getValue('artisanal_technique')
      return technique.name
    },
  },
  {
    accessorKey: 'status',
    header: 'Situação',
    cell: ({ row }) => {
      const isActive = row.getValue('status') === 'ACTIVE'
      return h(
        Badge,
        { class: isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600' },
        () => (isActive ? 'Ativo' : 'Desativado'),
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Data de Criação',
    cell: ({ row }) => formatDate(row.getValue('created_at')),
  },
  {
    id: 'product-actions',
    header: 'Ações',
    cell: ({ row }) => {
      const product = row.original
      const isActive = product.status === 'ACTIVE'

      return h('div', { class: 'flex gap-2' }, [
        h(
          ProductEditModal,
          {
            product,
            onSubmitSuccess: () => refresh(),
          },
        ),
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            onClick: () => isActive ? handleDeactivate(product.id) : handleActivate(product.id),
          },
          () => isActive
            ? h(XCircle, { class: 'w-4 h-4 text-red-500' })
            : h(CheckCircle, { class: 'w-4 h-4 text-green-500' }),
        ),
      ])
    },
  },
]

const handleView = (product: Product) => {
  useRouter().push('/products/' + product.id)
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="loading"
      class="flex justify-center p-8"
    >
      <div class="text-lg">
        Carregando...
      </div>
    </div>

    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded p-4"
    >
      <p class="text-red-700">
        {{ error }}
      </p>
    </div>

    <DataTable
      v-else
      :columns="columns"
      :data="products"
    />

    <div
      v-if="!loading && !error"
      class="text-sm text-gray-500"
    >
      Total de produtos: {{ totalItems }} | Página {{ currentPage }} de
      {{ totalPages }}
    </div>
  </div>
</template>

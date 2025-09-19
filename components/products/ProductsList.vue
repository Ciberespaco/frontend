<script lang="ts" setup>
import DataTable from '@/components/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/table-core'
import { formatCurrency, formatDate } from '~/lib/utils'
import { useProducts, type Product } from '~/composables/useProducts'
import { NuxtLink } from '#components'

const {
  fetchProducts,
  error,
  loading,
  totalItems,
  currentPage,
  totalPages,
  products,
} = useProducts()

onMounted(() => {
  fetchProducts()
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchProducts()
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
    cell: ({ row }) => formatCurrency(row.getValue('price')),
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
    header: 'Status',
    cell: ({ row }) => (row.getValue('status') === 'ACTIVE' ? 'Ativo' : 'Inativo'),
  },
  {
    accessorKey: 'created_at',
    header: 'Data de Criação',
    cell: ({ row }) => formatDate(row.getValue('created_at')),
  },
]

const handleView = (product: Product) => {
  useRouter().push('/products/' + product.id)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex justify-center p-8"
    >
      <div class="text-lg">
        Carregando...
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded p-4"
    >
      <p class="text-red-700">
        {{ error }}
      </p>
    </div>

    <!-- Data table -->
    <DataTable
      v-else
      :columns="columns"
      :data="products"
      :on-view="handleView"
    />

    <!-- Pagination info -->
    <div
      v-if="!loading && !error"
      class="text-sm text-gray-500"
    >
      Total de produtos: {{ totalItems }} | Página {{ currentPage }} de
      {{ totalPages }}
    </div>
  </div>
</template>

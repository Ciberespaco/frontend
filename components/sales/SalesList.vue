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
      :data="sales"
      :on-view="handleView"
    />
  </div>
</template>

<script lang="ts" setup>
import { useSales } from '#imports'
import type { ColumnDef } from '@tanstack/vue-table'
import type { SaleResponse } from '~/composables/useSales'
import { formatCurrency, formatDateTime } from '~/lib/utils'
import DataTable from '../table/DataTable.vue'
import Badge from '../ui/badge/Badge.vue'

const { fetchSales, sales, error, loading } = useSales()
onMounted(() => {
  fetchSales()
})

const columns: ColumnDef<SaleResponse, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID da Venda',
  },
  {
    accessorKey: 'date',
    header: 'Data da Venda',
    cell: ({ row }) => formatDateTime(row.getValue('date')),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => formatCurrency(row.getValue('total') as number / 100),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')

      return h(
        Badge,
        { variant: status ? 'default' : 'destructive' },
        status ? 'Finalizada' : 'Pendente',
      )
    },
  },
]

const handleView = (sale: SaleResponse) => {
  useRouter().push('/sales/' + sale.id)
}
</script>

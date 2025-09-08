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
      v-else-if="fetchError"
      class="bg-red-50 border border-red-200 rounded p-4"
    >
      <p class="text-red-700">
        {{ fetchError }}
      </p>
    </div>

    <!-- Data table -->
    <DataTable
      v-else
      :columns="columns"
      :data="ProductCategory"
      :on-delete="handleDelete"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table'
import { userProductCategory, type ProductCategory } from '~/composables/useProductCategory'
import DataTable from '../table/DataTable.vue'
import Swal from 'sweetalert2'

const { loading, fetchError, error, ProductCategory, fetchProductCategory, deleteProductCategory }
  = userProductCategory()

onMounted(() => {
  fetchProductCategory()
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchProductCategory()
}

const handleDelete = async (ProductCategory: ProductCategory) => {
  const result = await Swal.fire({
    title: 'Você tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, pode deletar!',
    cancelButtonText: 'Cancelar',
  })
  if (!result.isConfirmed) {
    return
  }

  try {
    await deleteProductCategory(ProductCategory.id)
    await Swal.fire({
      title: 'Deletado!',
      text: `Material com ID "${ProductCategory.id}" deletado!`,
      icon: 'success',
    })
  }
  catch (err: unknown) {
    Swal.fire({
      title: 'Erro!',
      text: error.value || (err as Error).message || 'Erro desconhecido',
      icon: 'error',
    }).finally(() => {
      refresh()
    })
  }
}

const columns: ColumnDef<ProductCategory, unknown>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => row.getValue('id'),
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.getValue('name'),
  },
]
</script>

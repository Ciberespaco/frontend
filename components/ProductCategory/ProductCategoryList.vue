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
      :data="productCategories || []"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { userProductCategory, type ProductCategory } from '~/composables/useProductCategory'
import DataTable from '../table/DataTable.vue'
import ProductCategoryEditModal from './ProductCategoryEditModal.vue'
import Button from '../ui/button/Button.vue'
import { Trash2 } from 'lucide-vue-next'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { loading, fetchError, productCategories, fetchProductCategory, deleteProductCategory }
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
  const result = await showConfirmDialog({
    title: 'Você tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    confirmButtonText: 'Sim, pode deletar!',
  })

  if (!result) {
    return
  }

  try {
    await deleteProductCategory(ProductCategory.id)
    showSuccessToast('Categoria excluída com sucesso!')
    fetchProductCategory()
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('categoria', 'excluir', String(err))
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
  {
    id: 'category-actions',
    header: 'Ações',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(ProductCategoryEditModal, {
          productCategory: row.original,
          onSubmitSuccess: refresh,
        }),
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          onClick: () => handleDelete(row.original),
        }, () => h(Trash2, { class: 'w-4 h-4 text-red-500' })),
      ])
    },
  },
]
</script>

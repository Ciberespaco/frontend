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
      :data="rawMaterials || []"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useRawMaterials, type RawMaterial } from '~/composables/useRawMaterials'
import DataTable from '../table/DataTable.vue'
import RawMaterialsEditModal from './RawMaterialsEditModal.vue'
import Button from '../ui/button/Button.vue'
import { Trash2 } from 'lucide-vue-next'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { loading, fetchError, rawMaterials, fetchRawMaterials, deleteRawMaterial }
  = useRawMaterials()

onMounted(() => {
  fetchRawMaterials()
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchRawMaterials()
}

const handleDelete = async (rawMaterial: RawMaterial) => {
  const result = await showConfirmDialog({
    title: 'Você tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    confirmButtonText: 'Sim, pode deletar!',
  })

  if (!result) {
    return
  }

  try {
    await deleteRawMaterial(rawMaterial.id)
    showSuccessToast('Material excluído com sucesso!')
    fetchRawMaterials()
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('material', 'excluir', String(err))
  }
}

const columns: ColumnDef<RawMaterial, unknown>[] = [
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
    id: 'material-actions',
    header: 'Ações',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(RawMaterialsEditModal, {
          rawMaterial: row.original,
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

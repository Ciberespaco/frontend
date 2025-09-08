<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center p-8">
      <div class="text-lg">
        Carregando...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="fetchError" class="bg-red-50 border border-red-200 rounded p-4">
      <p class="text-red-700">
        {{ fetchError }}
      </p>
    </div>

    <!-- Data table -->
    <DataTable v-else :columns="columns" :data="rawMaterials || []" :on-delete="handleDelete" />
  </div>
</template>

<script lang="ts" setup>
import type { ColumnDef } from '@tanstack/vue-table'
import { useRawMaterials } from '~/composables/useRawMaterials'
import DataTable from '../table/DataTable.vue'
import Swal from 'sweetalert2'

const { loading, fetchError, error, rawMaterials, fetchRawMaterials, deleteRawMaterial }
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
    await deleteRawMaterial(rawMaterial.id)
    await Swal.fire({
      title: 'Deletado!',
      text: `Material com ID "${rawMaterial.id}" deletado!`,
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
]
</script>

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
      :data="artisanTechniques || []"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { useArtisanTechniques, type ArtisanTechnique } from '~/composables/useArtisanTechniques'
import DataTable from '../table/DataTable.vue'
import ArtisanTechniquesEditModal from './ArtisanTechniquesEditModal.vue'
import Button from '../ui/button/Button.vue'
import { Trash2 } from 'lucide-vue-next'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { loading, fetchError, artisanTechniques, fetchArtisanTechniques, deleteArtisanTechnique } = useArtisanTechniques()

onMounted(() => {
  fetchArtisanTechniques()
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchArtisanTechniques()
}

const handleDelete = async (artisanTechnique: ArtisanTechnique) => {
  const result = await showConfirmDialog({
    title: 'Você tem certeza?',
    text: 'Esta ação não pode ser desfeita!',
    confirmButtonText: 'Sim, pode deletar!',
  })

  if (!result) {
    return
  }

  try {
    await deleteArtisanTechnique(artisanTechnique.id)
    showSuccessToast('Técnica excluída com sucesso!')
    fetchArtisanTechniques()
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('técnica artesanal', 'excluir', String(err))
  }
}

const columns: ColumnDef<ArtisanTechnique, unknown>[] = [
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
    id: 'artisan-actions',
    header: 'Ações',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(ArtisanTechniquesEditModal, {
          artisanTechnique: row.original,
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

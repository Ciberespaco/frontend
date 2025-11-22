<script setup lang="ts">
import DataTable from '@/components/table/DataTable.vue'
import type { ColumnDef } from '@tanstack/table-core'
import { formatCpf, formatDate } from '~/lib/utils'
import { useArtisans, type Artisan } from '~/composables/useArtisans'
import { onMounted } from 'vue'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { XCircle, CheckCircle, Pencil } from 'lucide-vue-next'
import { h } from 'vue'
import ArtisanEditModal from './ArtisanEditModal.vue'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const {
  artisans,
  loading,
  error,
  totalItems,
  currentPage,
  totalPages,
  fetchArtisans,
  deleteArtisan,
  activateArtisan,
} = useArtisans()

onMounted(() => {
  // Fetch all artisans (active and inactive)
  fetchArtisans(1, 10, undefined)
})

defineExpose({
  refresh,
})

async function refresh() {
  await fetchArtisans(currentPage.value, 10, undefined)
}

const handleDeactivate = async (artisan: Artisan) => {
  const result = await showConfirmDialog({
    title: 'Desativar Artesão?',
    text: 'O artesão será desativado e seus produtos ficarão indisponíveis.',
    confirmButtonText: 'Sim, desativar!',
  })

  if (!result) return

  try {
    await deleteArtisan(artisan.id)
    showSuccessToast('Artesão desativado com sucesso!')
  } catch (err: unknown) {
    ShowCrudErrorAlert('artesão', 'desativar', String(err))
  }
}

const handleActivate = async (artisan: Artisan) => {
  const result = await showConfirmDialog({
    title: 'Ativar Artesão?',
    text: 'O artesão será reativado.',
    confirmButtonText: 'Sim, ativar!',
    confirmButtonColor: '#16a34a',
  })

  if (!result) return

  try {
    await activateArtisan(artisan.id)
    showSuccessToast('Artesão ativado com sucesso!')
  } catch (err: unknown) {
    ShowCrudErrorAlert('artesão', 'ativar', String(err))
  }
}

const columns: ColumnDef<Artisan, unknown>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
    cell: ({ row }) => formatCpf(row.getValue('cpf')),
  },
  {
    accessorKey: 'municipal_seal',
    header: 'Selo Municipal',
    cell: ({ row }) => row.getValue('municipal_seal'),
  },
  {
    accessorKey: 'isActive',
    header: 'Situação',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive')
      return h(Badge, {
        class: isActive 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-red-500 hover:bg-red-600 text-white',
      }, () => isActive ? 'Ativo' : 'Desativado')
    },
  },
  {
    accessorKey: 'sex',
    header: 'Sexo',
    cell: ({ row }) => (row.getValue('sex') === 'F' ? 'Feminino' : 'Masculino'),
  },
  {
    accessorKey: 'localidade',
    header: 'Cidade',
    cell: ({ row }) => `${row.getValue('localidade')}/${row.original.uf}`,
  },
  {
    id: 'artisan-actions',
    header: 'Ações',
    cell: ({ row }) => {
      const artisan = row.original
      return h('div', { class: 'flex gap-2' }, [
        h(ArtisanEditModal, {
          artisan: artisan,
          onSubmitSuccess: refresh,
        }),
        h(Button, {
          variant: 'ghost',
          size: 'icon',
          onClick: () => artisan.isActive ? handleDeactivate(artisan) : handleActivate(artisan),
          title: artisan.isActive ? 'Desativar' : 'Ativar'
        }, () => artisan.isActive 
          ? h(XCircle, { class: 'w-4 h-4 text-red-500' }) 
          : h(CheckCircle, { class: 'w-4 h-4 text-green-500' })
        ),
      ])
    },
  },
]
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
      :data="artisans"
    />

    <div
      v-if="!loading && !error"
      class="text-sm text-gray-500"
    >
      Total de artesãos: {{ totalItems }} | Página {{ currentPage }} de
      {{ totalPages }}
    </div>
  </div>
</template>

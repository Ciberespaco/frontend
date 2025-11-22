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
      :data="paymentMethods || []"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { usePaymentMethods, type PaymentMethod } from '~/composables/usePaymentMethods'
import DataTable from '../table/DataTable.vue'
import PaymentMethodsCreateModal from './PaymentMethodsCreateModal.vue'
import PaymentMethodsEditModal from './PaymentMethodsEditModal.vue'
import Button from '../ui/button/Button.vue'
import { Trash2 } from 'lucide-vue-next'
import { showConfirmDialog, showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { paymentMethods, loading, error, fetchPaymentMethods, deletePaymentMethod } = usePaymentMethods()

onMounted(() => {
  fetchPaymentMethods()
})

const refreshList = () => {
  fetchPaymentMethods()
}

// Expose refresh method to parent
defineExpose({
  refresh: refreshList,
})

const handleDelete = async (paymentMethod: PaymentMethod) => {
  const confirmed = await showConfirmDialog(
    `Tem certeza que deseja excluir o método de pagamento "${paymentMethod.name}"?`,
    'Esta ação não poderá ser desfeita.',
  )

  if (confirmed) {
    try {
      await deletePaymentMethod(paymentMethod.id)
      showSuccessToast('Método de pagamento excluído com sucesso!')
    }
    catch (error) {
      ShowCrudErrorAlert(error)
    }
  }
}

const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: 'fee',
    header: 'Taxa (%)',
    cell: ({ row }) => `${row.original.fee}%`,
  },
  {
    id: 'method-actions',
    header: 'Ações',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-2' }, [
        h(PaymentMethodsEditModal, {
          paymentMethod: row.original,
          onSubmitSuccess: refreshList,
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

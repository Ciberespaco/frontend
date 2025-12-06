<template>
  <div class="flex flex-col h-full">
    <!-- Top Bar -->
    <div class="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
      <div>
        <Title>Balcão de Pedidos</Title>
        <h6 class="text-sm text-zinc-600">
          Crie novos pedidos
        </h6>
      </div>
      
      <div class="flex gap-4">
        <Button
          variant="outline"
          class="px-6 flex items-center gap-2"
          @click="openModal"
        >
          <Plus class="w-4 h-4" />
          Adicionar Produto
          <span class="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border ml-1">F2</span>
        </Button>

        <Button
          variant="destructive"
          class="px-6 flex items-center gap-2"
          @click="handleCancel"
        >
          <X class="w-4 h-4" />
          Cancelar Pedido
          <span class="text-xs text-red-200 bg-red-600/20 px-1.5 py-0.5 rounded border border-red-500/30 ml-1">F4</span>
        </Button>

        <Button
          :disabled="!canFinalizeSale"
          class="px-6 flex items-center gap-2"
          @click="handleFinalize"
        >
          <Check class="w-4 h-4" />
          Finalizar Pedido
          <span class="text-xs text-primary-foreground/70 bg-primary-foreground/20 px-1.5 py-0.5 rounded border border-primary-foreground/30 ml-1">F10</span>
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6 overflow-hidden flex flex-col gap-4">
      <SaleProductFormModal
        ref="modalRef"
        :initial-search="initialSearch"
      />
      
      <div class="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-6 h-full min-h-0">
        <!-- Left Column: Product List -->
        <div class="h-full flex flex-col bg-white rounded-lg border p-4 min-h-0">
          <h3 class="font-semibold text-lg mb-4 flex-none">Itens do Pedido</h3>
          <div
            class="flex-1 overflow-auto min-h-0"
          >
            <ProductTable :items="items" />
          </div>
        </div>

        <!-- Right Column: Summary -->
        <div class="h-full overflow-auto min-h-0">
          <SummaryPanel :subtotal="total" />
        </div>
      </div>
    </div>

    <!-- Footer / Disclaimer -->
    <div class="bg-zinc-50 border-t px-6 py-2 text-[11px] text-zinc-400 text-center flex items-center justify-center gap-2 select-none">
      <AlertTriangle class="w-3 h-3" />
      <span>
        Sistema para controle gerencial interno. Não possui homologação fiscal (NFC-e/SAT).
      </span>
    </div>
  </div>
</template>

<script setup>
import { Plus, X, Check, AlertTriangle } from 'lucide-vue-next'
import SummaryPanel from './SummaryPanel.vue'
import SaleProductFormModal from './SaleProductFormModal.vue'
import ProductTable from './ProductTable.vue'
import { usePdvStore, useSales } from '#imports'
import { storeToRefs } from 'pinia'
import { showErrorAlert, showLoadingAlert, showSuccessToast, showConfirmDialog, showWarningAlert } from '~/lib/swal'
import Title from '../basic/Title.vue'
import { Button } from '@/components/ui/button'

const pdvStore = usePdvStore()
const { total, canFinalizeSale, items } = storeToRefs(pdvStore)
const { createSale, error, loading } = useSales()

const modalRef = ref(null)
const initialSearch = ref('')

const openModal = () => {
  modalRef.value?.openModal()
}

const handleCancel = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Cancelar pedido?',
    text: "Todos os itens serão removidos.",
    confirmButtonText: 'Sim, cancelar',
    confirmButtonColor: '#d33'
  })

  if (confirmed) {
    pdvStore.clearSale()
    showSuccessToast('Pedido cancelado.')
  }
}

const handleFinalize = async () => {
  if (!canFinalizeSale.value) {
    showWarningAlert('Adicione produtos e selecione uma forma de pagamento para continuar.')
    return
  }

  if (loading.value) {
    showLoadingAlert('Processando seu pedido...')
  }

  try {
    await createSale()
    showSuccessToast('Pedido finalizado com sucesso!')
    pdvStore.clearSale()
  }
  catch (err) {
    showErrorAlert(error.value || err || 'Erro ao finalizar pedido. Tente novamente.')
  }
}

// Keyboard shortcut: open modal on typing
const handleKeyDown = (event) => {
  // Ignore if typing in an input/textarea or if modal is already open
  if (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'TEXTAREA' ||
    event.target.tagName === 'SELECT' ||
    event.target.isContentEditable
  ) {
    return
  }

  // Handle Shortcuts
  if (event.key === 'F2') {
    event.preventDefault()
    openModal()
    return
  }

  if (event.key === 'F4') {
    event.preventDefault()
    handleCancel()
    return
  }

  if (event.key === 'F10') {
    event.preventDefault()
    handleFinalize()
    return
  }

  // Ignore special keys for the "typing to search" feature
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.key === 'Tab' ||
    event.key === 'Escape' ||
    event.key === 'Enter' ||
    event.key.length > 1 
  ) {
    return
  }

  // Check if modal is already open
  if (modalRef.value?.isModalOpen()) {
    return
  }

  // Set initial search and open modal
  initialSearch.value = event.key
  nextTick(() => {
    modalRef.value?.openModal()
  })
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <span class="flex flex-col mb-8 justify-center items-center">
    <Title>Ponto de Venda</Title>
    <h6 class="text-lg text-zinc-600">
      Crie novas vendas
    </h6>
  </span>
  <div class="max-w-7xl md:max-w-6xl mx-auto p-6 space-y-6">
    <SaleProductFormModal
      ref="modalRef"
      :initial-search="initialSearch"
    />
    
    <div class="flex flex-col lg:grid-cols-3 gap-6">
      <div class="space-y-6">
        <SummaryPanel :subtotal="total" />
        <ActionButtons
          :can-finalize="canFinalizeSale"
          @cancel="handleCancel"
          @finalize="handleFinalize"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SummaryPanel from './SummaryPanel.vue'
import ActionButtons from './ActionButtons.vue'
import SaleProductFormModal from './SaleProductFormModal.vue'
import { usePdvStore, useSales } from '#imports'
import { storeToRefs } from 'pinia'
import { showErrorAlert, showLoadingAlert, showSuccessToast } from '~/lib/swal'
import Title from '../basic/Title.vue'

const pdvStore = usePdvStore()
const { total, canFinalizeSale } = storeToRefs(pdvStore)
const { createSale, error, loading } = useSales()

const modalRef = ref(null)
const initialSearch = ref('')

const handleCancel = () => {
  pdvStore.clearSale()
}

const handleFinalize = async () => {
  if (!canFinalizeSale.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Atenção',
      text: 'Adicione produtos e selecione uma forma de pagamento para continuar.',
    })
    return
  }

  if (loading.value) {
    showLoadingAlert('Processando sua venda...')
  }

  try {
    await createSale()
    showSuccessToast('Venda finalizada com sucesso!')
    pdvStore.clearSale()
  }
  catch (err) {
    showErrorAlert(error.value || err || 'Erro ao finalizar venda. Tente novamente.')
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

  // Ignore special keys
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.key === 'Tab' ||
    event.key === 'Escape' ||
    event.key === 'Enter' ||
    event.key.length > 1 // Ignore non-character keys like ArrowUp, F1, etc
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

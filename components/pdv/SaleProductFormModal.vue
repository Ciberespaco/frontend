<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button class="mb-4">
        <Plus class="w-4 h-4 mr-2" />
        Adicionar Produto
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Adicionar Produto à Venda</DialogTitle>
        <DialogDescription>
          Selecione o produto e informe a quantidade desejada.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <SaleProductForm
          ref="formRef"
          :initial-search="initialSearch"
          @submit-success="handleFormSuccess"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-vue-next'
import SaleProductForm from './SaleProductForm.vue'

const props = defineProps<{
  initialSearch?: string
}>()

const isOpen = ref(false)
const formRef = ref(null)

const handleFormSuccess = () => {
  isOpen.value = false
}

// Watch for initial search changes to open modal
watch(() => props.initialSearch, (newValue) => {
  if (newValue && !isOpen.value) {
    isOpen.value = true
    // Focus will be handled by the form component
  }
})

// Expose methods for parent to control modal
defineExpose({
  openModal: () => {
    isOpen.value = true
  },
  isModalOpen: () => {
    return isOpen.value
  },
})
</script>

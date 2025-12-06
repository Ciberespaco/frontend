<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button class="mb-4 cursor-pointer">
        <Plus class="w-4 h-4 mr-2" />
        Cadastrar Novo Produto (F2)
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Produto</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo produto ao sistema.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto max-h-[70vh] pr-6">
        <ProductCreateForm
          ref="formRef"
          @submit-success="handleFormSuccess"
        />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
import ProductCreateForm from './ProductCreateForm.vue'

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)
const formRef = ref<{ loadFormOptions: () => void } | null>(null)

const handleFormSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}

const reloadFormOptions = () => {
  formRef.value?.loadFormOptions()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'F2') {
    event.preventDefault()
    isOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  reloadFormOptions,
})
</script>

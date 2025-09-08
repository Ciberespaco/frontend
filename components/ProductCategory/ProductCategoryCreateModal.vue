<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="mb-4"
      >
        Cadastrar Nova Categoria de Produto
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Categoria de Produto</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar uma nova categoria de produtos ao sistema.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto max-h-[70vh] pr-6">
        <ProductCategoryCreateForm @submit-success="onFormSubmitSuccess" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ProductCategoryCreateForm from './ProductCategoryCreateForm.vue'

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

const onFormSubmitSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}
</script>

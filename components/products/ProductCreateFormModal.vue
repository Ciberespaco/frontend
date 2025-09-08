<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline" class="mb-4">
        Cadastrar Novo Produto
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
        <ProductCreateForm @submit-success="handleFormSuccess" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ProductCreateForm from './ProductCreateForm.vue'

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

function handleFormSuccess() {
  isOpen.value = false
  emit('submit-success')
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        size="sm"
        class="flex items-center gap-2"
      >
        <Pencil class="h-4 w-4" />
        Editar Produto
      </Button>
    </DialogTrigger>
    <DialogContent
      v-if="isOpen"
      class="sm:max-w-[625px]"
    >
      <DialogHeader>
        <DialogTitle>Editar Artesão</DialogTitle>
        <DialogDescription>
          Altere os campos abaixo para atualizar os dados do produto.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto max-h-[70vh] pr-6">
        <ProductEditForm
          :product="product"
          @submit-success="handleFormSuccess"
        />
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
import { Pencil } from 'lucide-vue-next'
import ProductEditForm from './ProductEditForm.vue'

defineProps<{
  product: Product
}>()

const isOpen = ref(false)

function handleFormSuccess() {
  isOpen.value = false
}
</script>

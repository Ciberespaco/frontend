<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="ghost" size="icon">
        <Pencil class="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Categoria de Produto</DialogTitle>
        <DialogDescription>
          Atualize os dados da categoria de produto.
        </DialogDescription>
      </DialogHeader>
      <ProductCategoryEditForm
        :product-category="productCategory"
        @submit-success="handleSuccess"
      />
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Pencil } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import ProductCategoryEditForm from './ProductCategoryEditForm.vue'
import type { ProductCategory } from '~/composables/useProductCategory'

defineProps<{
  productCategory: ProductCategory
}>()

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

const handleSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}
</script>

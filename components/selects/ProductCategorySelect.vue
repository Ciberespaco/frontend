<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { useProductCategoryStore } from '~/stores/useProductCategoryStore'

defineProps<FieldProps>()

const productCategoryStore = useProductCategoryStore()
const productCategories = computed(() => productCategoryStore.categories)
</script>

<template>
  <div>
    <BaseSelect
      :field-name="fieldName"
      :config="config"
      :required="required"
      :disabled="disabled"
      :options="productCategories || []"
      option-label="name"
      option-value="id"
      placeholder="Selecione uma categoria..."
    />
  </div>
</template>

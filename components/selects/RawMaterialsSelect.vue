<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { useRawMaterialsStore } from '#imports'

defineProps<FieldProps>()

const rawMaterialsStore = useRawMaterialsStore()
const rawMaterials = computed(() => rawMaterialsStore.rawMaterials)
</script>

<template>
  <div>
    <BaseSelect
      :field-name="fieldName"
      :config="config"
      :required="required"
      :disabled="disabled"
      :options="rawMaterials || []"
      option-label="name"
      option-value="id"
      placeholder="Selecione uma matéria-prima..."
    />
  </div>
</template>

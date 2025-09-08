<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { useArtisansStore } from '#imports'

defineProps<FieldProps>()

const artisansStore = useArtisansStore()
const artisans = computed(() => artisansStore.artisans)
</script>

<template>
  <div>
    <BaseSelect
      :field-name="fieldName"
      :config="config"
      :required="required"
      :disabled="disabled"
      :options="artisans || []"
      option-label="name"
      option-value="id"
      placeholder="Selecione um artesão..."
    />
  </div>
</template>

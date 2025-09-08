<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { useArtisanTechniquesStore } from '#imports'

defineProps<FieldProps>()

const artisanTechniquesStore = useArtisanTechniquesStore()
const artisanTechniques = computed(() => artisanTechniquesStore.artisanTechniques)
</script>

<template>
  <div>
    <BaseSelect :field-name="fieldName" :config="config" :required="required" :disabled="disabled"
      :options="artisanTechniques || []" option-label="name" option-value="id" placeholder="Selecione uma técnica..." />
  </div>
</template>

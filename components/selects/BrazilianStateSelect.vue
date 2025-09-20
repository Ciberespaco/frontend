<script setup lang="ts">
import BaseSelect from './BaseSelect.vue'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { BrazilianStates } from '~/lib/enums/brazilian-states'

defineProps<FieldProps>()
</script>

<template>
  <div>
    <BaseSelect
      :field-name="fieldName"
      :config="config"
      :required="required"
      :disabled="disabled"
      :options="BrazilianStates || []"
      option-label="name"
      option-value="id"
      placeholder="Selecione o estado..."
    />
  </div>
</template>

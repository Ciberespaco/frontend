<script setup lang="ts">
// ... seu script setup permanece o mesmo
import { reactive } from 'vue'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { AutoFormLabel } from '@/components/ui/auto-form'
import type { FieldProps } from '@/components/ui/auto-form/interface'

defineProps<FieldProps>()

const moneyConfig = reactive({
  precision: 2,
  prefix: 'R$ ',
  thousands: '.',
  decimal: ',',
  masked: false,
})
</script>

<template>
  <FormField :name="fieldName" v-slot="{ componentField, value }">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.label" :required="required">
        {{ config?.label || fieldName }}
      </AutoFormLabel>
      <FormControl>
        <Input
          type="text"
          placeholder="R$ 0,00"
          v-money="moneyConfig"
          
          :model-value="value"

             @update:model-value="(newValue) => {
            const digitsOnly = String(newValue || '').replace(/\D/g, '') || '0'
            const cents = parseInt(digitsOnly, 10)
            componentField.onChange(cents)
          }"
        />
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
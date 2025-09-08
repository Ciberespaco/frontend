<script setup lang="ts">
import { ref, reactive } from 'vue'
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

const inputValue = ref('')

const moneyConfig = reactive({
  precision: 2,
  prefix: 'R$ ',
  thousands: '.',
  decimal: ',',
  masked: false,
})


const parseMoneyToIntCents = (value: string): number => {
  if (!value)
    return 0

  let cleanValue = value.replace(/[^0-9,]/g, '').trim()
  cleanValue = cleanValue.replace(',', '.')
  const floatValue = parseFloat(cleanValue) || 0

  return Math.round(floatValue * 100)
}
</script>

<template>
  <FormField :name="fieldName" v-slot="{ componentField }">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || fieldName }}
      </AutoFormLabel>
      <FormControl>
        <Input type="text" placeholder="R$ 0,00" v-model="inputValue" v-money="moneyConfig" @input="(event: Event) => {
          const target = event.target as HTMLInputElement
          const numericValueInCents = parseMoneyToIntCents(target.value)
          componentField.onChange(numericValueInCents)
        }" />
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
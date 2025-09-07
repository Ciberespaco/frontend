<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { useCurrencyInput } from 'vue-currency-input'
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

const { inputRef, numberValue, setValue } = useCurrencyInput({
  currency: 'BRL',
  locale: 'pt-BR',
  autoDecimalDigits: true,
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: true,
})

</script>

<template>
  <FormField :name="fieldName" v-slot="{ componentField }">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || fieldName }}
      </AutoFormLabel>

      <FormControl>
        <Input ref="inputRef" type="text" inputmode="decimal" placeholder="R$ 0,00"
          :model-value="componentField.modelValue" />
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>
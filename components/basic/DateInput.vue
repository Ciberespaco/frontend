<template>
  <FormField
    v-slot="{ componentField }"
    :name="props.fieldName"
  >
    <FormItem>
      <FormControl>
        <Input
          v-mask="'##/##/####'"
          type="text"
          placeholder="DD/MM/AAAA"
          v-bind="componentField"
          :model-value="formatDateToMask(componentField.modelValue)"
          @update:model-value="
            (value) => componentField.onChange(parseMaskedDate(String(value)))
          "
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { formatDateToMask, parseMaskedDate } from '~/lib/utils'

const props = defineProps<FieldProps>()
</script>

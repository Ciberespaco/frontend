<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { AutoFormLabel } from '@/components/ui/auto-form'
import type { FieldProps } from '@/components/ui/auto-form/interface'

interface BaseSelectProps extends FieldProps {
  options: Record<string, any>[];
  optionValue: string;
  optionLabel: string;
  placeholder?: string;
}

defineProps<BaseSelectProps>()
</script>

<template>
  <FormField :name="fieldName" v-slot="{ componentField }">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || fieldName }}
      </AutoFormLabel>

      <Select v-if="options && options.length > 0" v-bind="componentField">
        <FormControl>
          <SelectTrigger>
            <SelectValue :placeholder="placeholder || 'Selecione uma opção...'" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem v-for="option in options" :key="option[optionValue]" :value="option[optionValue]">
              {{ option[optionLabel] }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
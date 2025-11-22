<script setup lang="ts">
import type { FieldProps } from './interface'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AutoFormLabel from './AutoFormLabel.vue'
import { beautifyObjectName, maybeBooleanishToBoolean } from './utils'
import { computed } from 'vue'

const props = defineProps<FieldProps & {
  options?: string[]
}>()

const normalizedOptions = computed(() => {
  const inputProps = props.config?.inputProps as unknown as Record<string, unknown>
  const customOptions = inputProps?.options as undefined | { label: string, value: string }[]
  
  if (customOptions && Array.isArray(customOptions)) {
    return customOptions
  }
  return props.options || []
})
</script>

<template>
  <FormField v-slot="slotProps" :name="fieldName" :validate-on-blur="false">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <slot v-bind="slotProps">
          <RadioGroup 
            v-if="config?.component === 'radio'" 
            :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" 
            :orientation="'vertical'" 
            v-bind="{ ...slotProps.componentField }"
          >
            <div v-for="(option, index) in normalizedOptions" :key="typeof option === 'object' ? option.value : option" class="mb-2 flex items-center gap-3 space-y-0">
              <RadioGroupItem 
                :id="`${typeof option === 'object' ? option.value : option}-${index}`" 
                :value="typeof option === 'object' ? option.value : option" 
              />
              <Label :for="`${typeof option === 'object' ? option.value : option}-${index}`">
                {{ typeof option === 'object' ? option.label : beautifyObjectName(option) }}
              </Label>
            </div>
          </RadioGroup>

          <Select 
            v-else 
            :disabled="maybeBooleanishToBoolean(config?.inputProps?.disabled) ?? disabled" 
            v-bind="{ ...slotProps.componentField }"
          >
            <SelectTrigger class="w-full">
              <SelectValue :placeholder="config?.inputProps?.placeholder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem 
                v-for="option in normalizedOptions" 
                :key="typeof option === 'object' ? option.value : option" 
                :value="typeof option === 'object' ? option.value : option"
              >
                {{ typeof option === 'object' ? option.label : beautifyObjectName(option) }}
              </SelectItem>
            </SelectContent>
          </Select>
        </slot>
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

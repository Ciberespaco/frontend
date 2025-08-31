<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { AutoFormLabel } from "@/components/ui/auto-form";
import type { FieldProps } from "@/components/ui/auto-form/interface";
import { Input } from "@/components/ui/input";

const props = defineProps<FieldProps>();
</script>

<template>
  <FormField v-slot="{ componentField }" :name="fieldName">
    <FormItem v-bind="$attrs">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || fieldName }}
      </AutoFormLabel>

      <FormControl>
        <Input
          type="text"
          inputmode="numeric"
          v-bind="componentField"
          v-mask="'###.###.###-##'"
        />
      </FormControl>

      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

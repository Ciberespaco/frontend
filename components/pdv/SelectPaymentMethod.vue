<template>
  <div>
    <Select v-model="model">
      <SelectTrigger id="payment-method">
        <SelectValue placeholder="Selecione o método" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="method in PaymentMethods"
            :key="method.id"
            :value="method.id"
          >
            {{ method.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PaymentMethods } from '~/lib/enums/payment_method'

const model = defineModel<string | null>()
</script>

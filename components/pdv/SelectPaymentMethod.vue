<script setup lang="ts">
import { onMounted } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePaymentMethods } from '~/composables/usePaymentMethods'

const model = defineModel<string | null>()

const { paymentMethods, fetchPaymentMethods, loading } = usePaymentMethods()

onMounted(() => {
  fetchPaymentMethods()
})
</script>

<template>
  <div>
    <Select
      v-model="model"
      :disabled="loading"
    >
      <SelectTrigger id="payment-method">
        <SelectValue :placeholder="loading ? 'Carregando...' : 'Selecione o método'" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="method in paymentMethods"
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

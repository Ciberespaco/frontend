<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
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
const isOpen = ref(false)

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'F3') {
    event.preventDefault()
    isOpen.value = true
  }
}

onMounted(() => {
  fetchPaymentMethods()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div>
    <Select
      v-model="model"
      v-model:open="isOpen"
      :disabled="loading"
    >
      <SelectTrigger id="payment-method-trigger">
        <SelectValue :placeholder="loading ? 'Carregando...' : 'Selecione o método (F3)'" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="method in paymentMethods"
            :key="method.id"
            :value="String(method.id)"
          >
            {{ method.name }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

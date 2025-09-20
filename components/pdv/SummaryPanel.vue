<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-center">Finalização</CardTitle>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex justify-between items-center py-2 border-b">
        <span class="font-medium">SubTotal</span>
        <span class="font-bold">{{ formatCurrency(subtotal) }}</span>
      </div>

      <div class="flex justify-between items-center py-2 border-b">
        <span class="font-medium">Acréscimo</span>
        <span class="text-sm text-gray-600">{{ acrescimoPercent }}%</span>
        <span class="font-bold">{{ formatCurrency(acrescimo) }}</span>
      </div>

      <div class="flex justify-between items-center py-2 border-b">
        <span class="font-medium">Desconto</span>
        <span class="text-sm text-gray-600">{{ descontoPercent }}%</span>
        <span class="font-bold">{{ formatCurrency(desconto) }}</span>
      </div>

      <div class="flex justify-between items-center py-3 border-t-2 border-gray-300">
        <span class="font-bold text-lg">Total a Pagar</span>
        <span class="font-bold text-lg">{{ formatCurrency(total) }}</span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const props = defineProps({
  subtotal: { type: Number, default: 0 },
  acrescimoPercent: { type: Number, default: 5 },
  descontoPercent: { type: Number, default: 5 }
})

const acrescimo = computed(() => (props.subtotal * props.acrescimoPercent) / 100)
const desconto = computed(() => (props.subtotal * props.descontoPercent) / 100)
const total = computed(() => props.subtotal + acrescimo.value - desconto.value)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
</script>
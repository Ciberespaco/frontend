<template>
  <ProductTable :items="items" />
  <Card class="mt-6">
    <CardHeader>
      <CardTitle class="text-center text-lg">
        Finalização
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-3 px-8">
      <div class="flex justify-between items-center py-2 border-b">
        <span class="font-medium">Valor Bruto</span>
        <span class="font-bold">{{ formatCurrency(totalBeforeDiscount / 100) }}</span>
      </div>

      <div class="flex justify-between items-center py-2 border-b">
        <span class="font-medium">Desconto</span>
        <span class="font-bold text-emerald-500">- {{ formatCurrency(totalDiscount / 100) }}</span>
      </div>

      <div class="flex justify-between items-center py-2">
        <span class="font-medium">Metodo de Pagamento</span>
        <SelectPaymentMethod v-model="selectedPaymentMethod" />
      </div>

      <div class="flex justify-between items-center py-3 border-t-2 border-gray-300">
        <span class="font-bold text-lg">Total a Pagar</span>
        <span class="font-bold text-lg">{{ formatCurrency(total / 100) }}</span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { usePdvStore } from '#imports'
import { formatCurrency } from '~/lib/utils'
import ProductTable from './ProductTable.vue'
import Card from '../ui/card/Card.vue'
import CardHeader from '../ui/card/CardHeader.vue'
import SelectPaymentMethod from './SelectPaymentMethod.vue'

const pdvStore = usePdvStore()
const { items, total, totalDiscount, totalBeforeDiscount, selectedPaymentMethod } = storeToRefs(pdvStore)
</script>

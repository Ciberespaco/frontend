<template>
  <div>
    <Table>
      <TableHeader class="sticky top-0 z-10 bg-white shadow-sm">
        <TableRow class="bg-gray-50 hover:bg-gray-50">
          <TableHead>
            Código do Produto
          </TableHead>
          <TableHead>
            Produto
          </TableHead>
          <TableHead>
            Quantidade
          </TableHead>
          <TableHead>
            Valor unitário
          </TableHead>
          <TableHead>
            Artesão
          </TableHead>
          <TableHead>
            Desconto
          </TableHead>
          <TableHead>
            SubTotal
          </TableHead>
          <TableHead class="text-center">
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in reversedItems"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <TableCell>
            {{ item.codigo }}
          </TableCell>
          <TableCell>
            {{ item.produto }}
          </TableCell>
          <TableCell>
            {{ item.quantidade }}
          </TableCell>
          <TableCell>
            {{ formatCurrency(item.valorUnitario / 100) }}
          </TableCell>
          <TableCell>
            {{ item.artesao?.name }}
          </TableCell>
          <TableCell>
            {{ formatCurrency(item.desconto / 100) }}
          </TableCell>
          <TableCell>
            {{ formatCurrency(item.subtotal / 100) }}
          </TableCell>
          <TableCell class="text-center">
            <Button
              variant="ghost"
              size="icon"
              @click="() => removeItem(item.id)"
              class="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup>
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-vue-next'
import { formatCurrency } from '~/lib/utils'
import { usePdvStore } from '#imports'
import { computed } from 'vue'

const pdvStore = usePdvStore()

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const reversedItems = computed(() => {
  return [...props.items].reverse()
})

const removeItem = (itemId) => {
  pdvStore.removeItem(itemId)
}
</script>

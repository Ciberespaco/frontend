<template>
  <div class="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow class="bg-gray-50">
          <TableHead class="text-center">
            Código do Produto
          </TableHead>
          <TableHead class="text-center">
            Produto
          </TableHead>
          <TableHead class="text-center">
            Quantidade
          </TableHead>
          <TableHead class="text-center">
            Valor unitário
          </TableHead>
          <TableHead class="text-center">
            Artesão
          </TableHead>
          <TableHead class="text-center">
            Desconto
          </TableHead>
          <TableHead class="text-center">
            SubTotal
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in items"
          :key="item.id"
          class="hover:bg-gray-50"
        >
          <TableCell class="text-center">
            {{ item.codigo }}
          </TableCell>
          <TableCell class="text-center">
            {{ item.produto }}
          </TableCell>
          <TableCell class="text-center">
            {{ item.quantidade }}
          </TableCell>
          <TableCell class="text-center">
            {{ formatCurrency(item.valorUnitario / 100) }}
          </TableCell>
          <TableCell class="text-center">
            {{ item.artesao?.name }}
          </TableCell>
          <TableCell class="text-center">
            {{ formatCurrency(item.desconto / 100) }}
          </TableCell>
          <TableCell class="text-center">
            {{ formatCurrency(item.subtotal / 100) }}
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
import { formatCurrency } from '~/lib/utils'

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

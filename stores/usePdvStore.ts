// ~/stores/pdvStore.ts (ARQUIVO RENOMEADO E CÓDIGO ATUALIZADO)

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { z } from 'zod';
import type { SaleItemSchema } from '~/lib/schemas/create-sale.schema';

// A interface SaleItem continua a mesma
export interface SaleItem {
  id: string;
  productId: string;
  codigo: number;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  artesao?: { name: string };
  desconto: number;
  subtotal: number;
}

type FormData = z.infer<typeof SaleItemSchema>;

// ✨ Nome da store e da função atualizados ✨
export const usePdvStore = defineStore('pdv', () => {
  // --- STATE ---
  const items = ref<SaleItem[]>([]);

  // --- GETTERS ---
  const total = computed(() => {
    return items.value.reduce((acc, item) => acc + item.subtotal, 0);
  });

  // --- ACTIONS ---
  function addItem(formData: FormData) {
    const { product, quantity, discount = 0 } = formData;
    if (!product || !product.id) {
      console.error("Produto inválido ou não selecionado.");
      return;
    }
    const valorUnitario = product.price || 0; 
    const subtotal = (valorUnitario * quantity) - discount;

    const newItem: SaleItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      codigo: product.product_code || 0,
      produto: product.name,
      quantidade: quantity,
      valorUnitario: valorUnitario,
      artesao: product.artisan,
      desconto: discount,
      subtotal: subtotal,
    };
    items.value.push(newItem);
  }

  function clearSale() {
    items.value = [];
  }

  return {
    items,
    total,
    addItem,
    clearSale,
  };
});
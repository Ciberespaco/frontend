// ~/lib/schemas/create-sale.schema.ts

import { z } from 'zod'
import type { FieldConfig } from '~/components/ui/auto-form'
import CurrencyInput from '~/components/basic/CurrencyInput.vue'
import ProductSearchCombobox from '~/components/pdv/ProductSearchCombobox.vue'

const ProductObjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  product_code: z.number(),
  quant: z.number(),
  price: z.number(),
  artisan: z.object({
    name: z.string(),
  }).optional(),
}).optional()

export const SaleItemSchema = z.object({
  product: ProductObjectSchema.refine(val => val?.id, {
    message: 'Selecione um produto.',
  }),
  quantity: z.coerce.number().min(1, 'A quantidade mínima é 1.'),
  discount: z.number()
    .min(0, 'O desconto não pode ser negativo.')
    .default(0),
})

export const saleItemFieldConfig = {
  product: {
    label: 'Produto',
    component: ProductSearchCombobox,
    description: 'Digite para buscar e selecionar um produto.',
  },
  quantity: {
    label: 'Quantidade',
    inputProps: {
      type: 'number',
      min: 1,
    },
  },
  discount: {
    label: 'Desconto (R$)',
    component: CurrencyInput,
  },
} satisfies FieldConfig<typeof SaleItemSchema>

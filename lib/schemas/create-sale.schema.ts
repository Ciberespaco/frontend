import { z } from 'zod'
import CurrencyInput from '~/components/basic/CurrencyInput.vue'
import ProductSearchInput from '~/components/pdv/ProductSearchInput.vue'
import type { Config } from '~/components/ui/auto-form'

const ProductObjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
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
  quantity: z.coerce.number().min(1, 'A quantidade mínima é 1.').default(1),
  discount: z.number()
    .min(0, 'O desconto não pode ser negativo.')
    .default(0),
})

export type SaleItemSchemaType = z.infer<typeof SaleItemSchema>

export function createSaleItemFieldConfig(initialSearch?: string): Config<SaleItemSchemaType> {
  return {
    product: {
      label: 'Produto',
      component: ProductSearchInput,
      description: 'Digite para buscar e selecionar um produto.',
      componentProps: {
        initialSearch,
      },
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
  } satisfies Config<SaleItemSchemaType> as unknown
}

// Default export for backward compatibility
export const saleItemFieldConfig = createSaleItemFieldConfig()

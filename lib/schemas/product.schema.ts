import { z } from 'zod'
import CurrencyInput from '~/components/basic/CurrencyInput.vue'
import ArtisanSelect from '~/components/selects/ArtisanSelect.vue'
import ArtisanTechniquesSelect from '~/components/selects/ArtisanTechniquesSelect.vue'
import ProductCategorySelect from '~/components/selects/ProductCategorySelect.vue'
import RawMaterialsSelect from '~/components/selects/RawMaterialsSelect.vue'
import type { Config } from '~/components/ui/auto-form'

const idSchema = (message: string) =>
  z.coerce.number({ required_error: message, invalid_type_error: message }).int().positive()

export const productSchema = z.object({
  name: z
    .string({ required_error: 'O nome do produto é obrigatório.' })
    .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  product_code: z.coerce
    .number({ required_error: 'O código do produto é obrigatório.', invalid_type_error: 'Deve ser um número.' })
    .int('O código deve ser um número inteiro.')
    .positive('O código deve ser um número positivo.'),
  barcode: z
    .string({ required_error: 'O código de barras é obrigatório.', invalid_type_error: 'Deve ser um número.' })
    .min(1, 'O código de barras não pode estar vazio.'),
  price: z.number({ required_error: 'O preço é obrigatório.' })
    .min(0, 'O preço não pode ser negativo.')
    .default(0),
  quant: z.coerce
    .number({
      required_error: 'A quantidade é obrigatória.',
      invalid_type_error: 'Deve ser um número.'
    })
    .int('A quantidade deve ser um número inteiro.')
    .min(1, {
      message: 'A quantidade deve ser pelo menos 1.',
    })
    .max(9999, {
      message: 'A quantidade deve ser menor ou igual a 9999.',
    })
    .nonnegative('A quantidade não pode ser negativa.').default(1),
  description: z
    .string()
    .optional()
    .default(''),
  obs: z
    .string()
    .optional()
    .default(''),

  artisan_id: idSchema('A seleção do artesão é obrigatória.'),
  raw_material_id: idSchema('A seleção da matéria-prima é obrigatória.'),
  artisanal_technique_id: idSchema('A seleção da técnica artesanal é obrigatória.'),
  product_category_id: idSchema('A seleção da categoria é obrigatória.'),
})

export type ProductSchema = z.infer<typeof productSchema>

export const fieldConfig = {
  name: {
    label: 'Nome do Produto',
  },
  product_code: {
    label: 'Código do Produto',
    inputProps: {
      type: 'number',
    },
  },
  barcode: {
    label: 'Código de Barras',
  },
  price: {
    label: 'Preço (R$)',
    component: CurrencyInput,
  },
  quant: {
    label: 'Quantidade em Estoque',
    inputProps: {
      type: 'number',
      min: '0',
    },
  },
  description: {
    component: 'textarea',
    label: 'Descrição do Produto',
    inputProps: {
      placeholder: 'Detalhes sobre o produto, como dimensões, cor, etc.',
    },
  },
  obs: {
    component: 'textarea',
    label: 'Observações (Opcional)',
    inputProps: {
      placeholder: 'Instruções de cuidado, detalhes de fragilidade, etc.',
    },
  },

  artisan_id: {
    label: 'Artesão',
    component: ArtisanSelect,
  },
  product_category_id: {
    label: 'Categoria do Produto',
    component: ProductCategorySelect,
  },
  raw_material_id: {
    label: 'Matéria-Prima Principal',
    component: RawMaterialsSelect,
  },
  artisanal_technique_id: {
    label: 'Técnica Artesanal',
    component: ArtisanTechniquesSelect,
  },
} satisfies Config<ProductSchema>

import type { FieldConfig } from '~/components/ui/auto-form'
import z from 'zod'

export const ProductcategorySchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
})

export type ProductCategorySchema = z.infer<typeof ProductcategorySchema>

export const fieldConfig = {
  name: {
    type: 'text',
    label: 'Nome',
    placeholder: 'Digite o nome da Categoria',
  },
} satisfies FieldConfig<typeof ProductcategorySchema>

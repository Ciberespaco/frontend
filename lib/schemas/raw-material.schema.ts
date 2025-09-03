import type { FieldConfig } from '~/components/ui/auto-form'
import z from 'zod'

export const rawMaterialSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
})

export type RawMaterialSchema = z.infer<typeof rawMaterialSchema>

export const fieldConfig = {
  name: {
    type: 'text',
    label: 'Nome',
    placeholder: 'Digite o nome do material',
  },
} satisfies FieldConfig<typeof rawMaterialSchema>

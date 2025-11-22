import { z } from 'zod'

export const PaymentMethodSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    fee: z.coerce.number().min(0, 'Taxa deve ser maior ou igual a 0'),
})

export type PaymentMethodFormValues = z.infer<typeof PaymentMethodSchema>

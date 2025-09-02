import { z } from 'zod'
import { isValidCpf } from '../utils'
import CpfInput from '~/components/basic/CpfInput.vue'
import type { FieldConfig } from '~/components/ui/auto-form'

export const artisanSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  cpf: z
    .string({ required_error: 'O CPF é obrigatório.' })
    .transform(val => val.replace(/\D/g, ''))
    .refine(isValidCpf, { message: 'CPF inválido.' }),
  municipal_seal: z.string().min(1, 'O selo municipal é obrigatório.'),
  sex: z.enum(['M', 'F'], { required_error: 'O sexo é obrigatório.' }),

  birthdate: z.coerce.date({
    required_error: 'A data de nascimento é obrigatória.',
  }),
  cep: z.string().min(8, 'O CEP deve ter pelo menos 8 caracteres.'),
  house_number: z.string().min(1, 'O número é obrigatório.'),
  bairro: z.string().min(1, 'O bairro é obrigatório.'),
  localidade: z.string().min(1, 'A localidade é obrigatória.'),
  uf: z.string().length(2, 'A UF deve ter 2 caracteres.'),
  estado: z.string().min(1, 'O estado é obrigatório.'),
  artisan_register_date: z.coerce.date({
    required_error: 'A data de registro é obrigatória.',
  }),
  exit_date: z.coerce.date().nullable().optional(),
  obs: z
    .string()
    .optional()
    .nullable()
    .transform(val => val || null),
})

export type ArtisanSchema = z.infer<typeof artisanSchema>

export const fieldConfig = {
  sex: {
    component: 'radio',
    label: 'Sexo',
    items: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Feminino' },
    ],
  },
  obs: {
    component: 'textarea',
    label: 'Observações',
    componentProps: {
      placeholder: 'Detalhes adicionais sobre o artesão...',
    },
  },
  name: { label: 'Nome Completo' },
  cpf: {
    label: 'CPF',
    component: CpfInput,
  },
  municipal_seal: { label: 'Selo Municipal' },
  cep: { label: 'CEP' },
  house_number: { label: 'Número' },
  bairro: { label: 'Bairro' },
  localidade: { label: 'Localidade (Cidade)' },
  uf: { label: 'UF' },
  estado: { label: 'Estado' },
  birthdate: { label: 'Data de Nascimento', component: 'date' },
  artisan_register_date: {
    label: 'Data de Registro do Artesão',
    component: 'date',
  },
  exit_date: { label: 'Data de Saída (Opcional)', component: 'date' },
} satisfies FieldConfig<typeof artisanSchema>

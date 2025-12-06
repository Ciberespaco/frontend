import type { InputHTMLAttributes } from 'vue'
import { z } from 'zod'
import CpfInput from '~/components/basic/CpfInput.vue'
import type { Config } from '~/components/ui/auto-form'
import { isValidCpf } from '../utils'

export const artisanSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),

  cpf: z.string()
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length > 0, 'CPF é obrigatório')
    .refine(isValidCpf, 'CPF inválido'),

  municipal_seal: z.string().min(1, 'Selo municipal é obrigatório'),

  sex: z.enum(['M', 'F'], {
    required_error: 'Selecione o sexo',
  }),

  birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),

  cep: z.string().min(8, 'CEP inválido'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  house_number: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  localidade: z.string().min(1, 'Cidade é obrigatória'),
  uf: z.string().min(2, 'UF obrigatória'),
  estado: z.string().min(1, 'Estado obrigatório'),

  artisan_register_date: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),
  exit_date: z.string()
    .optional()
    .nullable()
    .transform(val => val === '' || val === undefined ? null : val),
  obs: z.string()
    .optional()
    .nullable()
    .transform(val => val === '' || val === undefined ? null : val),
})

export type ArtisanSchema = z.infer<typeof artisanSchema>

export const artisanFieldConfig: Config<ArtisanSchema> = {
  municipal_seal: {
    label: 'Selo Municipal',
  },
  cpf: {
    label: 'CPF',
    component: CpfInput,
  },
  sex: {
    label: 'Sexo',
    component: 'select',
    inputProps: {
      placeholder: 'Selecione...',
      options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino', value: 'F' },
      ],
    } as unknown as InputHTMLAttributes & { options: { label: string, value: string }[] },
  },
  birthdate: {
    label: 'Data de Nascimento',
    inputProps: { type: 'date' },
  },
  artisan_register_date: {
    label: 'Data de Registro',
    inputProps: { type: 'date' },
  },
  exit_date: {
    label: 'Data de Saída (Opcional)',
    inputProps: { type: 'date' },
  },
  cep: {
    label: 'CEP',
    inputProps: { placeholder: 'Digite o CEP (somente números)' },
  },
  logradouro: {
    label: 'Logradouro (Rua, Av, etc.)',
  },
  house_number: {
    label: 'Número',
  },
  bairro: {
    label: 'Bairro',
  },
  localidade: {
    label: 'Cidade',
    inputProps: { readonly: true },
  },
  uf: {
    label: 'UF',
    inputProps: { readonly: true, placeholder: 'SP' },
  },
  estado: {
    label: 'Estado',
    inputProps: { readonly: true, placeholder: 'São Paulo' },
  },
  obs: {
    component: 'textarea',
    label: 'Observações',
  },
}

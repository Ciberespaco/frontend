import { z } from "zod";
import { isValidCpf } from "../utils";

export const artisanSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório."
    })
    .min(3, "O nome deve ter pelo menos 3 caracteres."),

  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(isValidCpf, {
      message: "CPF inválido."
    }),

  municipal_seal: z.string().min(1, "O selo municipal é obrigatório."),

  sex: z.enum(["M", "F"], {
    required_error: "O sexo é obrigatório."
  }),

  birthdate: z.coerce.date({
    required_error: "A data de nascimento é obrigatória.",
    invalid_type_error: "Formato de data inválido."
  }),

  cep: z.string().min(8, "O CEP deve ter pelo menos 8 caracteres."),

  house_number: z.string().min(1, "O número é obrigatório."),

  bairro: z.string().min(1, "O bairro é obrigatório."),

  localidade: z.string().min(1, "A localidade é obrigatória."),

  uf: z.string().length(2, "A UF deve ter 2 caracteres."),

  estado: z.string().min(1, "O estado é obrigatório."),

  artisan_register_date: z.coerce.date({
    required_error: "A data de registro é obrigatória.",
    invalid_type_error: "Formato de data inválido."
  }),

  exit_date: z.coerce
    .date({
      invalid_type_error: "Formato de data inválido."
    })
    .optional()
    .nullable(),

  obs: z.string().nullable().optional()
});

export type ArtisanSchema = z.infer<typeof artisanSchema>;

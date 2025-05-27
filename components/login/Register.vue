<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from '#app'
import { useRegister } from '@/composables/useRegister'
import AuthForm from '@/components/login/AuthForm.vue'
import { Input } from '@/components/ui/input'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

/* schema */
const formSchema = toTypedSchema(
  z
    .object({
      name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
      email: z.string().email('Email inválido'),
      password: z
        .string()
        .min(6)
        .max(20)
        .regex(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
          'Senha fraca: deve conter letras maiúsculas, minúsculas e número ou caractere especial',
        ),
      passwordConfirmation: z.string().min(6),
    })
    .refine(d => d.password === d.passwordConfirmation, {
      message: 'As senhas não coincidem',
      path: ['passwordConfirmation'],
    }),
)
const form = useForm({ validationSchema: formSchema })

/* fields */
const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError }
  = useField<string>('password')
const { value: passwordConfirmation, errorMessage: passwordConfirmationError }
  = useField<string>('passwordConfirmation')

/* api */
const { register, apiError, loading } = useRegister()
const router = useRouter()
const onSubmit = form.handleSubmit(async (values) => {
  await register(values.email, values.password, values.name)
  if (!apiError.value) router.push('/login')
})
</script>

<template>
  <AuthForm
    title="Criar Conta"
    subtitle="Preencha os campos abaixo para criar uma nova conta."
    submit-label="Criar Conta"
    :loading="loading"
    :api-error="apiError"
    :on-submit="onSubmit"
    secondary-href="/login"
    secondary-label="Entrar"
  >
    <!-- fields -->
    <FormField name="name">
      <FormItem>
        <FormLabel>Nome Completo</FormLabel>
        <FormControl>
          <Input
            v-model="name"
            type="text"
          />
        </FormControl>
        <FormMessage>{{ nameError }}</FormMessage>
      </FormItem>
    </FormField>

    <FormField name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            v-model="email"
            type="email"
          />
        </FormControl>
        <FormMessage>{{ emailError }}</FormMessage>
      </FormItem>
    </FormField>

    <FormField name="password">
      <FormItem>
        <FormLabel>Senha</FormLabel>
        <FormControl>
          <Input
            v-model="password"
            type="password"
          />
        </FormControl>
        <FormMessage>{{ passwordError }}</FormMessage>
      </FormItem>
    </FormField>

    <FormField name="passwordConfirmation">
      <FormItem>
        <FormLabel>Confirmação de Senha</FormLabel>
        <FormControl>
          <Input
            v-model="passwordConfirmation"
            type="password"
          />
        </FormControl>
        <FormMessage>{{ passwordConfirmationError }}</FormMessage>
      </FormItem>
    </FormField>
  </AuthForm>
</template>

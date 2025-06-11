<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuth } from '@/composables/useAuth'
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
  z.object({
    email: z.string().email('Email inválido'),
  }),
)

/* form */
const form = useForm({ validationSchema: formSchema })
const { value: email, errorMessage: emailError } = useField<string>('email')

/* auth composable */
const { forgotPassword, error: apiError, loading } = useAuth()

/* ação de envio */
const onSubmit = form.handleSubmit((values) => {
  forgotPassword(values.email)
})
</script>

<template>
  <AuthForm
    title="Recuperar senha"
    subtitle="Informe seu e-mail para receber um link de recuperação."
    submit-label="Enviar link"
    :loading="loading"
    :api-error="apiError"
    :on-submit="onSubmit"
    secondary-href="/login"
    secondary-label="Voltar para o login"
  >
    <FormField name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input v-model="email" type="email" placeholder="seu@email.com" />
        </FormControl>
        <FormMessage>{{ emailError }}</FormMessage>
      </FormItem>
    </FormField>
  </AuthForm>
</template>
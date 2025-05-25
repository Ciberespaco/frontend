<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from '#app'
import { useAuth } from '@/composables/useAuth'
import AuthForm from '@/components/login/AuthForm.vue'
import { Input } from '@/components/ui/input'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'

/* schema + vee-validate */
const formSchema = toTypedSchema(z.object({
  email: z.string().email('Email inválido'),
  password: z.string(),
}))
const form = useForm({ validationSchema: formSchema, validateOnMount: false })
const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')

/* api  */
const { login, error: apiError, loading } = useAuth()
const router = useRouter()
const onSubmit = form.handleSubmit(values => {
  login(values.email, values.password)
  router.push('/')
})
</script>

<template>
  <AuthForm
    title="Login"
    subtitle="Insira o seu email e senha para entrar na sua conta."
    submitLabel="Entrar"
    :loading="loading"
    :apiError="apiError"
    :onSubmit="onSubmit"
    secondary-href="/register"
    secondary-label="Cadastre-se"
  >
    <!-- fields -->
    <FormField name="email">
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" v-model="email" placeholder="m@example.com" />
        </FormControl>
        <FormMessage>{{ emailError }}</FormMessage>
      </FormItem>
    </FormField>

    <FormField name="password">
      <FormItem>
        <div class="flex items-center justify-between">
          <FormLabel>Senha</FormLabel>
          <a href="/forgot-password" class="text-sm underline">Esqueci minha senha</a>
        </div>
        <FormControl>
          <Input type="password" v-model="password" />
        </FormControl>
        <FormMessage>{{ passwordError }}</FormMessage>
      </FormItem>
    </FormField>
  </AuthForm>
</template>
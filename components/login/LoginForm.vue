<script lang="ts">
export const description = 'Login page usando shadcn-vue Form + Vee-Validate + Zod'
export const iframeHeight = '800px'
export const containerClass = 'w-full h-full p-4 lg:p-0'
</script>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from '#app'
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/composables/useAuth'

const formSchema = toTypedSchema(z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
}))

const form = useForm({
    validationSchema: formSchema,
    validateOnMount: false,

})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: password, errorMessage: passwordError } = useField<string>('password')
const { login, error: apiError, loading } = useAuth()
const router = useRouter()

const onSubmit = form.handleSubmit((values) => {
    login(values.email, values.password)
    router.push('/')
})
</script>

<template>
    <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div class="flex items-center justify-center py-12">
            <form class="mx-auto grid w-[350px] gap-6" @submit="onSubmit">
                <AlertError v-if="apiError" type="error" :message="apiError" class="mb-4" />
                <div class="grid gap-2 text-center">
                    <h1 class="text-3xl font-bold">Login</h1>
                    <p class="text-balance text-muted-foreground">
                        Insira o seu email e senha para entrar na sua conta.
                    </p>
                </div>

                <!-- Email -->
                <FormField name="email">
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" v-model="email" placeholder="m@example.com" />
                        </FormControl>
                        <FormMessage>{{ emailError }}</FormMessage>
                    </FormItem>
                </FormField>

                <!-- Password -->
                <FormField name="password">
                    <FormItem>
                        <div class="flex items-center justify-between">
                            <FormLabel>Senha</FormLabel>
                            <a href="/forgot-password" class="text-sm underline">
                                Esqueci minha senha
                            </a>
                        </div>
                        <FormControl>
                            <Input type="password" v-model="password" />
                        </FormControl>
                        <FormMessage>{{ passwordError }}</FormMessage>
                    </FormItem>
                </FormField>
                <Button type="submit" class="w-full" :disabled="loading">
                    {{ loading ? 'Entrando…' : 'Login' }}
                </Button>

                <p class="mt-4 text-center text-sm">
                    Não possui conta?
                    <a href="#" class="underline">Cadastre-se</a>
                </p>
            </form>
        </div>
        <div class="hidden bg-muted lg:flex">
            <img src="/images/login/login-photo.jpg" alt="Image" width="1920" height="1080"
                class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
        </div>
    </div>
</template>
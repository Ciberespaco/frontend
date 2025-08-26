<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import swal from 'sweetalert2'
import { Switch } from '@/components/ui/switch'
import { useChangePassword } from '@/composables/useChangePassword'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'

const props = defineProps<{
  userId: string | number
}>()

const emit = defineEmits<{
  passwordChanged: []
}>()

const { changePassword, loading } = useChangePassword()
const shouldChangePassword = ref(false)

const schema = toTypedSchema(
  z
    .object({
      currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
      newPassword: z
        .string()
        .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
        .regex(
          /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,20}$/,
          'Senha fraca: 6–20 caracteres com maiúscula, minúscula e número ou símbolo',
        ),
      confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'As senhas não coincidem',
    }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const { value: currentPassword, errorMessage: currentPasswordError }
  = useField<string>('currentPassword')
const { value: newPassword, errorMessage: newPasswordError }
  = useField<string>('newPassword')
const { value: confirmPassword, errorMessage: confirmPasswordError }
  = useField<string>('confirmPassword')

const onSubmit = handleSubmit(async (values) => {
  try {
    await changePassword(props.userId, {
      oldPassword: values.currentPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    })

    swal.fire('Sucesso', 'Senha alterada com sucesso!', 'success')

    resetForm()
    shouldChangePassword.value = false
    useRouter().push('/login')

    emit('passwordChanged')
  }
  catch (err: unknown) {
    const errorMessage
      = err instanceof Error ? err.message : 'Ocorreu um erro inesperado.'
    swal.fire('Erro', errorMessage, 'error')
  }
})

watch(shouldChangePassword, (newValue) => {
  if (!newValue) {
    resetForm()
  }
})
</script>

<template>
  <div class="p-6 bg-white rounded-lg shadow-md">
    <h3 class="text-lg font-semibold mb-4">
      Alterar Senha
    </h3>

    <div class="mb-4 flex flex-col gap-4">
      <span class="flex items-center gap-2">
        <Switch v-model="shouldChangePassword" />
        <label for="shouldChangePassword">Desejo alterar minha senha</label>
      </span>
      <Separator />
    </div>

    <form
      v-if="shouldChangePassword"
      @submit.prevent="onSubmit"
    >
      <FormField name="currentPassword">
        <FormItem class="mb-4">
          <FormLabel>Senha Atual</FormLabel>
          <FormControl>
            <Input
              v-model="currentPassword"
              type="password"
              placeholder="Digite sua senha atual"
            />
          </FormControl>
          <FormMessage>{{ currentPasswordError }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Nova senha -->
      <FormField name="newPassword">
        <FormItem class="mb-4">
          <FormLabel>Nova Senha</FormLabel>
          <FormControl>
            <Input
              v-model="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
            />
          </FormControl>
          <FormMessage>{{ newPasswordError }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Confirmação da nova senha -->
      <FormField name="confirmPassword">
        <FormItem class="mb-6">
          <FormLabel>Confirme a Nova Senha</FormLabel>
          <FormControl>
            <Input
              v-model="confirmPassword"
              type="password"
              placeholder="Repita a nova senha"
            />
          </FormControl>
          <FormMessage>{{ confirmPasswordError }}</FormMessage>
        </FormItem>
      </FormField>

      <!-- Botão de alterar senha -->
      <div class="flex gap-2">
        <Button
          type="submit"
          variant="default"
          :disabled="loading"
        >
          Alterar Senha
        </Button>
        <Button
          type="button"
          variant="secondary"
          @click="shouldChangePassword = false"
        >
          Cancelar
        </Button>
      </div>
    </form>
  </div>
</template>

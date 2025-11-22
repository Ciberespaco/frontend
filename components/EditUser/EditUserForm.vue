<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import swal from 'sweetalert2'
import { showSuccessToast } from '~/lib/swal'
import { useUpdateUser } from '@/composables/useUpdateUser'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps<{
  user: { id: number | number, name: string, email: string }
}>()
const emit = defineEmits<{
  updated: [{ name: string, email: string }]
  cancel: []
}>()
const { updateUser, apiError } = useUpdateUser()

const schema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.user.name,
    email: props.user.email,
  },
})

const { value: name, errorMessage: nameError } = useField<string>('name')
const { value: email, errorMessage: emailError } = useField<string>('email')

watch(
  () => props.user,
  u =>
    resetForm({
      values: {
        name: u.name,
        email: u.email,
      },
    }),
)

const loading = computed(() => pending.value)
const pending = ref(false)

const onSubmit = handleSubmit(async (values) => {
  pending.value = true
  try {
    await updateUser({ name: values.name, email: values.email })

    showSuccessToast('Dados atualizados com sucesso!')
    emit('updated', { name: values.name, email: values.email })
  }
  catch {
    const errorMessage = apiError.value || 'Erro ao atualizar usuário'
    swal.fire('Erro', errorMessage, 'error')
  }
  finally {
    pending.value = false
  }
})
</script>

<template>
  <form
    class="p-6 bg-white rounded-lg shadow-md"
    @submit.prevent="onSubmit"
  >
    <h2 class="text-xl font-semibold mb-4">
      Editar Perfil
    </h2>

    <!-- nome -->
    <FormField name="name">
      <FormItem class="mb-4">
        <FormLabel>Nome Completo</FormLabel>
        <FormControl>
          <Input
            v-model="name"
            type="text"
            placeholder="Seu nome"
          />
        </FormControl>
        <FormMessage>{{ nameError }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- email -->
    <FormField name="email">
      <FormItem class="mb-4">
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
          />
        </FormControl>
        <FormMessage>{{ emailError }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- botões -->
    <div class="flex gap-2">
      <Button
        type="submit"
        variant="default"
        :disabled="loading"
      >
        Salvar
      </Button>
      <Button
        type="button"
        variant="secondary"
        @click="emit('cancel')"
      >
        Cancelar
      </Button>
    </div>
  </form>
</template>

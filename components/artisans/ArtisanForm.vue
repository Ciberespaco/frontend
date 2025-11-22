<template>
  <AutoForm
    class="space-y-4"
    :schema="artisanSchema"
    :field-config="artisanFieldConfig"
    :form="form"
    @submit="onSubmit"
  >
    <div class="flex justify-end">
      <Button type="submit">
        {{ submitText || 'Salvar' }}
      </Button>
    </div>
  </AutoForm>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { watch } from 'vue'
import axios from 'axios'
import { artisanSchema, artisanFieldConfig, type ArtisanSchema } from '~/lib/schemas/artisan.schema'
import { AutoForm } from '~/components/ui/auto-form'
import { Button } from '~/components/ui/button'

const props = defineProps<{
  initialValues?: Partial<ArtisanSchema>
  submitText?: string
}>()

const emit = defineEmits<{
  (e: 'submit', values: ArtisanSchema): void
}>()

const form = useForm<ArtisanSchema>({
  validationSchema: toTypedSchema(artisanSchema),
  initialValues: props.initialValues || {},
})

watch(
  () => form.values.cep,
  async (newCep) => {
    const cleanCep = newCep?.replace(/\D/g, '')

    if (cleanCep && cleanCep.length === 8) {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`)

      if (!data.erro) {
        form.setFieldValue('logradouro', data.logradouro)
        form.setFieldValue('bairro', data.bairro)
        form.setFieldValue('localidade', data.localidade)
        form.setFieldValue('uf', data.uf)
        form.setFieldValue('estado', data.estado)

        const numberInput = document.querySelector('input[name="house_number"]') as HTMLInputElement | null
        numberInput?.focus()
      }
    }
  },
)

const onSubmit = (values: ArtisanSchema) => {
  emit('submit', values)
}
</script>

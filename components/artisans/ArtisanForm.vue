<template>
  <AutoForm
    :id="formId"
    class="space-y-4 pb-20"
    :schema="artisanSchema"
    :field-config="artisanFieldConfig"
    :form="form"
    @submit="onSubmit"
  >
    <div
      v-if="!hideButton"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10 md:pl-64"
    >
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
  formId?: string
  hideButton?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', values: ArtisanSchema): void
}>()

const form = useForm<ArtisanSchema>({
  validationSchema: toTypedSchema(artisanSchema),
  initialValues: {
    ...props.initialValues,
    artisan_register_date: props.initialValues?.artisan_register_date || new Date().toISOString().split('T')[0],
  },
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

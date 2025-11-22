<template>
  <AutoForm
    v-if="props.artisan"
    :schema="artisanSchema"
    :field-config="artisanFieldConfig"
    :form="form"
    class="space-y-4"
    @submit="onUpdate"
  >
    <Button type="submit">
      Salvar Alterações
    </Button>
  </AutoForm>
</template>

<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import {
  artisanSchema,
  artisanFieldConfig,
  type ArtisanSchema,
} from '@/lib/schemas/artisan.schema'
import { useArtisans, type Artisan } from '@/composables/useArtisans'
import { showSuccessToast, ShowCrudErrorAlert, showConfirmDialog } from '~/lib/swal'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { watch } from 'vue'
import axios from 'axios'

const props = defineProps<{
  artisan: Artisan
}>()

const form = useForm<ArtisanSchema>({
  validationSchema: toTypedSchema(artisanSchema),
})

const emit = defineEmits(['submit-success'])

function toInputDate(dateValue: string | Date | null | undefined): string | undefined {
  if (!dateValue) return undefined
  const d = new Date(dateValue)
  if (isNaN(d.getTime())) return undefined

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

watch(
  () => props.artisan,
  (newArtisan) => {
    if (newArtisan) {
      form.setValues({
        ...newArtisan,
        sex: newArtisan.sex as 'M' | 'F',
        birthdate: toInputDate(newArtisan.birthdate),
        artisan_register_date: toInputDate(newArtisan.artisan_register_date),
        exit_date: toInputDate(newArtisan.exit_date),
        logradouro: newArtisan.logradouro,
        house_number: newArtisan.house_number,
        bairro: newArtisan.bairro,
        localidade: newArtisan.localidade,
        uf: newArtisan.uf,
        estado: newArtisan.estado,
        cep: newArtisan.cep,
      } as unknown as ArtisanSchema)
    }
  },
  { immediate: true },
)

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
      }
    }
  },
)

const { editArtisan, deleteArtisan, activateArtisan } = useArtisans()

async function onUpdate(values: ArtisanSchema) {
  try {
    await editArtisan(props.artisan.id, values)
    showSuccessToast('Artesão atualizado com sucesso!')
    emit('submit-success', values)
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('artesão', 'atualizar', String(err))
  }
}
</script>

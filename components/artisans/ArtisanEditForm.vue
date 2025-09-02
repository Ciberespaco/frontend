<template>
  <AutoForm
    v-if="props.artisan"
    :schema="artisanSchema"
    :field-config="fieldConfig"
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
  fieldConfig,
  type ArtisanSchema,
} from '@/lib/schemas/artisan.schema'
import { useArtisans } from '@/composables/useArtisans'
import Swal from 'sweetalert2'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { toCalendarDate } from '~/lib/utils'

const props = defineProps<{
  artisan: Artisan
}>()

const form = useForm({
  validationSchema: toTypedSchema(artisanSchema),
})

const emit = defineEmits(['submit-success'])
watch(
  () => props.artisan,
  (newArtisan) => {
    if (newArtisan) {
      form.setValues({
        ...newArtisan,
        birthdate: toCalendarDate(newArtisan.birthdate),
        artisan_register_date: toCalendarDate(newArtisan.artisan_register_date),
        exit_date: toCalendarDate(newArtisan.exit_date),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any)
    }
  },
  { immediate: true },
)
const { editArtisan, error } = useArtisans()

async function onUpdate(values: ArtisanSchema) {
  try {
    await editArtisan(props.artisan.id, values)
    Swal.fire(
      'Atualizado!',
      'Os dados do artesão foram atualizados com sucesso.',
      'success',
    )
    emit('submit-success', values)
  }
  catch (err: unknown) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao Atualizar',
      text: error.value || String(err) || 'Ocorreu um erro inesperado.',
    })
  }
}
</script>

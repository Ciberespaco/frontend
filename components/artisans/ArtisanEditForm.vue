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
import { toCalendarDate } from '@internationalized/date'

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
        birthdate: new Date(newArtisan.birthdate),
        artisan_register_date: new Date(newArtisan.artisan_register_date),
        exit_date: newArtisan.exit_date ? new Date(newArtisan.exit_date) : null,
      })
    }
  },
  { immediate: true },
)

const { editArtisan, loading, error } = useArtisans()

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
      text: error.value || 'Ocorreu um erro inesperado.',
    })
  }
}
</script>

<template>
  <AutoForm
    :schema="artisanSchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit">
      Salvar Artesão
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
import { useArtisans, type Artisan } from '@/composables/useArtisans'
import Swal from 'sweetalert2'
import { showSuccessToast } from '~/lib/swal'

const emit = defineEmits(['submit-success'])
defineProps<{
  initialData?: Artisan
}>()

const { createArtisan, error } = useArtisans()
async function onSubmit(values: ArtisanSchema) {
  try {
    await createArtisan(values)
    showSuccessToast('Artesão criado com sucesso!')
    emit('submit-success', values)
  }
  catch (err: unknown) {
    Swal.fire({
      icon: 'error',
      title: 'Erro ao criar',
      text: error.value || String(err) || 'Ocorreu um erro inesperado.',
    })
  }
}
</script>

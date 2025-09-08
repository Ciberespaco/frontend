<template>
  <AutoForm
    :schema="artisanTechniqueSchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit">
      Salvar Técnica
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { type ArtisanTechniqueSchema, artisanTechniqueSchema, fieldConfig } from '~/lib/schemas/artisan-technique.schema'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { useArtisanTechniques } from '~/composables/useArtisanTechniques'
import Swal from 'sweetalert2'

const { createArtisanTechnique, error } = useArtisanTechniques()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: ArtisanTechniqueSchema) => {
  try {
    await createArtisanTechnique(values)
    Swal.fire({
      icon: 'success',
      title: 'Criado!',
      text: 'O técnica foi criada com sucesso.',
    })
    emit('submit-success')
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

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
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { createArtisanTechnique } = useArtisanTechniques()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: ArtisanTechniqueSchema) => {
  try {
    await createArtisanTechnique(values)
    showSuccessToast('Técnica artesanal criada com sucesso!')
    emit('submit-success')
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('técnica artesanal', 'criar', String(err))
  }
}
</script>

<template>
  <AutoForm
    :schema="artisanTechniqueSchema"
    :field-config="fieldConfig"
    :form="form"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit" class="mt-4">
      Salvar
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { artisanTechniqueSchema, fieldConfig } from '~/lib/schemas/artisan-technique.schema'
import type z from 'zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { useArtisanTechniques, type ArtisanTechnique } from '~/composables/useArtisanTechniques'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'
import { formatError } from '~/lib/utils'

const props = defineProps<{
  artisanTechnique: ArtisanTechnique
}>()

const emit = defineEmits(['submit-success'])

const { updateArtisanTechnique } = useArtisanTechniques()

const form = useForm({
  validationSchema: toTypedSchema(artisanTechniqueSchema),
})

watch(() => props.artisanTechnique, (newValue) => {
  if (newValue) {
    form.setValues({
      name: newValue.name,
    })
  }
}, { immediate: true, deep: true })

const onSubmit = async (data: z.infer<typeof artisanTechniqueSchema>) => {
  try {
    await updateArtisanTechnique(props.artisanTechnique.id, data)
    showSuccessToast('Técnica atualizada com sucesso!')
    emit('submit-success')
  }
  catch (error) {
    ShowCrudErrorAlert('Técnica Artesanal', 'atualizar', formatError(error))
  }
}
</script>

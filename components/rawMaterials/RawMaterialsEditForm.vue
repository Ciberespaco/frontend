<template>
  <AutoForm
    :schema="rawMaterialSchema"
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
import { rawMaterialSchema, fieldConfig } from '~/lib/schemas/raw-material.schema'
import type z from 'zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { useRawMaterials, type RawMaterial } from '~/composables/useRawMaterials'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'
import { formatError } from '~/lib/utils'

const props = defineProps<{
  rawMaterial: RawMaterial
}>()

const emit = defineEmits(['submit-success'])

const { updateRawMaterial } = useRawMaterials()

const form = useForm({
  validationSchema: toTypedSchema(rawMaterialSchema),
})

watch(() => props.rawMaterial, (newValue) => {
  if (newValue) {
    form.setValues({
      name: newValue.name,
    })
  }
}, { immediate: true, deep: true })

const onSubmit = async (data: z.infer<typeof rawMaterialSchema>) => {
  try {
    await updateRawMaterial(props.rawMaterial.id, data)
    showSuccessToast('Material atualizado com sucesso!')
    emit('submit-success')
  }
  catch (error) {
    ShowCrudErrorAlert('Matéria Prima', 'atualizar', formatError(error))
  }
}
</script>

<template>
  <AutoForm
    :schema="rawMaterialSchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit">
      Salvar Material
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { fieldConfig, rawMaterialSchema, type RawMaterialSchema } from '~/lib/schemas/raw-material.schema'
import { useRawMaterials } from '~/composables/useRawMaterials'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { createRawMaterial } = useRawMaterials()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: RawMaterialSchema) => {
  try {
    await createRawMaterial(values)
    showSuccessToast('Material criado com sucesso!')
    emit('submit-success')
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('material', 'criar', String(err))
  }
}
</script>

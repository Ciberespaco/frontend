<template>
  <AutoForm
    :schema="rawMaterialSchema"
    :field-config="fieldConfig"
    class="space-y-4 pb-20"
    @submit="onSubmit"
  >
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10 md:pl-64">
      <Button type="submit">
        Salvar Material
      </Button>
    </div>
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

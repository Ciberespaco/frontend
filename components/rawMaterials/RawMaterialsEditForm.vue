<template>
  <AutoForm
    :schema="rawMaterialSchema"
    :field-config="fieldConfig"
    :form="form"
    class="space-y-4 pb-20"
    @submit="onSubmit"
  >
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10 md:pl-64">
      <Button type="submit">
        Salvar
      </Button>
    </div>
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

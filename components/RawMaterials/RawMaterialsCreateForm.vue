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
import Swal from 'sweetalert2'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'

const { createRawMaterial, error } = useRawMaterials()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: RawMaterialSchema) => {
  try {
    await createRawMaterial(values)
    Swal.fire({
      icon: 'success',
      title: 'Criado!',
      text: 'O material foi criado com sucesso.',
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

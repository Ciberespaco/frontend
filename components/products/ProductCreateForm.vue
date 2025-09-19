<template>
  <!-- Loading state -->
  <div v-if="formLoading" class="flex justify-center items-center p-8">
    <div class="text-lg">
      Carregando opções do formulário...
    </div>
  </div>

  <!-- Error state -->
  <div v-else-if="loadFormError" class="bg-red-50 border border-red-200 rounded p-4">
    <p class="text-red-700">
      Erro ao carregar opções do formulário: {{ loadFormError }}
    </p>
  </div>

  <!-- Form -->
  <AutoForm v-else :schema="productSchema" :field-config="fieldConfig" class="space-y-4" @submit="onSubmit">
    <Button type="submit">
      Salvar Produto
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import AutoForm from '../ui/auto-form/AutoForm.vue'
import { Button } from '@/components/ui/button'
import { productSchema, fieldConfig, type ProductSchema } from '~/lib/schemas/product.schema'
import { useProducts } from '@/composables/useProducts'
import Swal from 'sweetalert2'
import { useProductFormOptions } from '@/composables/useProductFormOptions'
import { showErrorAlert, showSuccessToast } from '~/lib/swal'

const { createProduct, error } = useProducts()
const { loadFormOptions, loading: formLoading, error: loadFormError } = useProductFormOptions()
const emit = defineEmits(['submit-success'])

onMounted(() => {
  try {
    loadFormOptions()
  }
  catch (err: unknown) {
    const errMsg = loadFormError.value || String(err)
    showErrorAlert(errMsg)
  }
})

const onSubmit = async (data: ProductSchema) => {
  try {
    await createProduct(data)
    showSuccessToast('Produto criado com sucesso!')
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

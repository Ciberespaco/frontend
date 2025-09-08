<template>
  <AutoForm
    :schema="ProductcategorySchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit">
      Salvar Categoria de Produto
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { fieldConfig, ProductcategorySchema, type ProductCategorySchema } from '@/lib/schemas/product-category.schema'
import { userProductCategory } from '~/composables/useProductCategory'
import Swal from 'sweetalert2'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'

const { createProductCategory, error } = userProductCategory()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: ProductCategorySchema) => {
  try {
    await createProductCategory(values)
    Swal.fire({
      icon: 'success',
      title: 'Criado!',
      text: 'A categoria foi criado com sucesso.',
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

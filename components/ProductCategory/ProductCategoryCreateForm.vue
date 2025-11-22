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
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const { createProductCategory } = userProductCategory()

const emit = defineEmits(['submit-success'])
const onSubmit = async (values: ProductCategorySchema) => {
  try {
    await createProductCategory(values)
    showSuccessToast('Categoria criada com sucesso!')
    emit('submit-success')
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('categoria', 'criar', String(err))
  }
}
</script>

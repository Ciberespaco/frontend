<template>
  <AutoForm
    :schema="ProductcategorySchema"
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
import { ProductcategorySchema, fieldConfig } from '~/lib/schemas/product-category.schema'
import type z from 'zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { userProductCategory, type ProductCategory } from '~/composables/useProductCategory'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'
import { formatError } from '~/lib/utils'

const props = defineProps<{
  productCategory: ProductCategory
}>()

const emit = defineEmits(['submit-success'])

const { updateProductCategory } = userProductCategory()

const form = useForm({
  validationSchema: toTypedSchema(ProductcategorySchema),
})

watch(() => props.productCategory, (newValue) => {
  if (newValue) {
    form.setValues({
      name: newValue.name,
    })
  }
}, { immediate: true, deep: true })

const onSubmit = async (data: z.infer<typeof ProductcategorySchema>) => {
  try {
    await updateProductCategory(props.productCategory.id, data)
    showSuccessToast('Categoria atualizada com sucesso!')
    emit('submit-success')
  }
  catch (error) {
    ShowCrudErrorAlert('Categoria de Produto', 'atualizar', formatError(error))
  }
}
</script>

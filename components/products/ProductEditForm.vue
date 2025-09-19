<template>
  <AutoForm
    v-if="props.product"
    :schema="productSchema"
    :field-config="fieldConfig"
    :form="form"
    class="space-y-4"
    @submit="onUpdate"
  >
    <Button type="submit">
      Salvar Alterações
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import { productSchema, fieldConfig, type ProductSchema } from '~/lib/schemas/product.schema'
import { useForm } from 'vee-validate'
import Button from '../ui/button/Button.vue'
import type { Product } from '~/composables/useProducts'
import { useProducts } from '~/composables/useProducts'
import { ShowCrudErrorAlert, showSuccessToast } from '~/lib/swal'

const props = defineProps<{
  product: Product
}>()

const form = useForm<ProductSchema>({
  validationSchema: toTypedSchema(productSchema),
})

watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      const formValues = {
        ...newProduct,
        artisan_id: newProduct.artisan.id,
        raw_material_id: newProduct.raw_material.id,
        artisanal_technique_id: newProduct.artisanal_technique.id,
        product_category_id: newProduct.product_category.id,
        price: newProduct.price,
      }
      form.setValues(formValues)
    }
  },
  { immediate: true },
)
const { editProduct } = useProducts()
const emit = defineEmits(['submit-success'])

const onUpdate = async (values: ProductSchema) => {
  try {
    await editProduct(values, props.product.id)
    showSuccessToast('Produto alterado com sucesso!')
    emit('submit-success', values)
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('produto', 'editar', String(err))
  }
}
</script>

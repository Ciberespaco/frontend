<template>
  <AutoForm
    v-if="props.product"
    :schema="productSchema"
    :field-config="editFieldConfig"
    :form="form"
    class="space-y-4 pb-20"
    @submit="onUpdate"
  >
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-end gap-4 z-10 md:pl-64">
      <Button type="submit">
        Salvar Alterações
      </Button>
    </div>
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
      console.log('ProductEditForm received:', newProduct)
      const formValues = {
        name: newProduct.name,
        product_code: newProduct.product_code,
        barcode: newProduct.barcode,
        price: newProduct.price,
        quant: newProduct.quant,
        description: newProduct.description ?? '',
        obs: newProduct.obs ?? '',
        artisan_id: newProduct.artisan.id,
        raw_material_id: newProduct.raw_material.id,
        artisanal_technique_id: newProduct.artisanal_technique.id,
        product_category_id: newProduct.product_category.id,
      }
      console.log('Setting form values:', formValues)
      form.setValues(formValues)
    }
  },
  { immediate: true },
)
const { editProduct } = useProducts()
const emit = defineEmits(['submit-success'])

// Override field config to disable product_code for editing
const editFieldConfig = {
  ...fieldConfig,
  product_code: {
    ...fieldConfig.product_code,
    inputProps: {
      ...fieldConfig.product_code?.inputProps,
      disabled: true,
    },
  },
}

const onUpdate = async (values: ProductSchema) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { product_code, ...updatePayload } = values
    // @ts-expect-error updatePayload matches the schema minus product_code
    await editProduct(updatePayload, props.product.id)
    showSuccessToast('Produto alterado com sucesso!')
    emit('submit-success', values)
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('produto', 'editar', String(err))
  }
}
</script>

<template>
  <AutoForm v-if="props.product" :schema="productSchema" :field-config="fieldConfig" :form="form" class="space-y-4"
    @submit="onUpdate">
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

const props = defineProps<{
  product: Product
}>()

onMounted(() => { console.log(props.product) })

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

const onUpdate = (values: ProductSchema) => {
  console.log('Dados prontos para enviar:', values)
  alert('Formulário enviado com sucesso! Verifique o console.')
}
</script>
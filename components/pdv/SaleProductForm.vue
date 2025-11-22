<template>
  <AutoForm
    :schema="SaleItemSchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit">
      Adicionar
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { SaleItemSchema, createSaleItemFieldConfig } from '~/lib/schemas/create-sale.schema'
import { usePdvStore } from '#imports'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import type z from 'zod'
import { showErrorAlert } from '~/lib/swal'
import { computed } from 'vue'

const props = defineProps<{
  initialSearch?: string
}>()

const emit = defineEmits(['submit-success'])

const pdvStore = usePdvStore()

// Create field config dynamically based on initialSearch
const fieldConfig = computed(() => createSaleItemFieldConfig(props.initialSearch))

const onSubmit = (data: z
  .infer<typeof SaleItemSchema>) => {
  try {
    validateProductStock(data)
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    showErrorAlert(errorMessage)
    return
  }

  pdvStore.addItem(data)
  emit('submit-success')
}

const validateProductStock = (data: z
  .infer<typeof SaleItemSchema>) => {
  if ((data.product?.quant ?? 0) < data.quantity) {
    throw new Error('Quantidade em estoque insuficiente.')
  }
}
</script>

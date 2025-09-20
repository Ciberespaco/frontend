<template>
  <InfoCard
    title="Adicionar Produto"
    :icon="Package"
  >
    <AutoForm
      :schema="SaleItemSchema"
      :field-config="saleItemFieldConfig"
      class="space-y-4"
      @submit="onSubmit"
    >
      <Button type="submit">
        Adicionar Produto
      </Button>
    </AutoForm>
  </InfoCard>
</template>

<script lang="ts" setup>
import { SaleItemSchema, saleItemFieldConfig } from '~/lib/schemas/create-sale.schema'
import { usePdvStore } from '#imports'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import type z from 'zod'
import InfoCard from '../InfoCard/InfoCard.vue'
import { Package } from 'lucide-vue-next'
import { showErrorAlert } from '~/lib/swal'

const pdvStore = usePdvStore()

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
}

const validateProductStock = (data: z
  .infer<typeof SaleItemSchema>) => {
  if ((data.product?.quant ?? 0) < data.quantity) {
    throw new Error('Quantidade em estoque insuficiente.')
  }
}
</script>

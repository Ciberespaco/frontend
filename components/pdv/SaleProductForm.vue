<template>
  <AutoForm :schema="SaleItemSchema" :field-config="saleItemFieldConfig" class="space-y-4" @submit="onSubmit">
    <Button type="submit">
      Adicionar Produto
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { SaleItemSchema, saleItemFieldConfig } from '~/lib/schemas/create-sale.schema';
import AutoForm from '../ui/auto-form/AutoForm.vue';
import Button from '../ui/button/Button.vue';

const onSubmit = (data: typeof SaleItemSchema._type) => {
  console.log(data);
};

</script>

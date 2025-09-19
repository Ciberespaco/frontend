<template>
  <ProductsProductCreateFormModal @submit-success="onProductCreated" />
  <ProductsList ref="productsListComponent" />
</template>

<script lang="ts" setup>
import ProductsList from './ProductsList.vue'

const productsListComponent = ref()

const onProductCreated = () => {
  productsListComponent.value.refresh()
}

</script>

<template>
  <ProductCategoryCreateModal @submit-success="onProductCategoryCreated" />
  <ProductCategoryList ref="ProductCategoryListComponent" />
</template>

<script lang="ts" setup>
import ProductCategoryList from './ProductCategoryList.vue'
import ProductCategoryCreateModal from './ProductCategoryCreateModal.vue'

const ProductCategoryListComponent = ref()

const onProductCategoryCreated = () => {
  ProductCategoryListComponent.value?.refresh()
}
</script>

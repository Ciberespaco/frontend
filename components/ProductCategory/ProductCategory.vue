<template>
  <div class="space-y-4">
    <ProductCategoryCreateModal @submit-success="handleUpdate" />

    <ProductCategoryList :key="refreshKey" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ProductCategoryList from './ProductCategoryList.vue'
import ProductCategoryCreateModal from './ProductCategoryCreateModal.vue'

const refreshKey = ref(0)

const handleUpdate = () => {
  refreshKey.value++
}
</script>

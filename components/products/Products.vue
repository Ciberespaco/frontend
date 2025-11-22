<template>
  <div class="space-y-4">
    <ProductCreateFormModal
      ref="productModalRef"
      @submit-success="handleUpdate"
    />

    <ProductsList :key="refreshKey" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type ProductCreateFormModal from './ProductCreateFormModal.vue'

const refreshKey = ref(0)
const productModalRef = ref<InstanceType<typeof ProductCreateFormModal> | null>(null)

const handleUpdate = () => {
  refreshKey.value++
}

// Expose method for child modals to call when they create a new option
const reloadProductFormOptions = () => {
  productModalRef.value?.reloadFormOptions()
}

// Make it available globally via provide/inject
provide('reloadProductFormOptions', reloadProductFormOptions)
</script>

<template>
  <div class="space-y-4">
    <RawMaterialsCreateModal @submit-success="handleUpdate" />

    <RawMaterialsList :key="refreshKey" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import RawMaterialsList from './RawMaterialsList.vue'
import RawMaterialsCreateModal from './RawMaterialsCreateModal.vue'

const refreshKey = ref(0)

const handleUpdate = () => {
  refreshKey.value++
}
</script>

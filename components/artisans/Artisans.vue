<template>
  <div class="space-y-4">
    <ArtisanFormModal @submit-success="handleUpdate" />
    <ArtisansList :key="refreshKey" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const refreshKey = ref(0)

const handleUpdate = () => {
  refreshKey.value++
}
</script>

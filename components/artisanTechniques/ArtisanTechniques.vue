<template>
  <div class="space-y-4">
    <ArtisanTechniquesCreateModal @submit-success="handleUpdate" />

    <ArtisanTechniquesList :key="refreshKey" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArtisanTechniquesCreateModal from './ArtisanTechniquesCreateModal.vue'
import ArtisanTechniquesList from './ArtisanTechniquesList.vue'

const refreshKey = ref(0)

const handleUpdate = () => {
  refreshKey.value++
}
</script>

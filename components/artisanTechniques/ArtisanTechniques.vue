<template>
  <ArtisanTechniquesCreateModal @submit-success="onArtisanTechniqueCreated" />
  <ArtisanTechniquesList ref="artisanTechniquesListComponent" />
</template>

<script setup lang="ts">
import ArtisanTechniquesCreateModal from './ArtisanTechniquesCreateModal.vue'
import ArtisanTechniquesList from './ArtisanTechniquesList.vue'

const artisanTechniquesListComponent = ref()

const onArtisanTechniqueCreated = () => {
  artisanTechniquesListComponent.value.refresh()
}
</script>

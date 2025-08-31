<template>
  <ArtisanFormModal @submit-success="onArtisanCreated" />
  <ArtisansList ref="artisansListComponent" />
</template>
<script setup lang="ts">
import ArtisansList from "./ArtisansList.vue";
import ArtisanFormModal from "./ArtisanFormModal.vue";

const artisansListComponent = ref();

const onArtisanCreated = () => {
  artisansListComponent.value.refresh();
};
</script>

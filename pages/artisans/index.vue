<template>
  <div class="container mx-auto px-6 py-8">
    <Artisans />
  </div>
</template>

<script setup lang="ts">
import ArtisansList from "@/components/artisans/Artisans.vue";

// Definir meta da página
definePageMeta({
  layout: "logged"
});
</script>

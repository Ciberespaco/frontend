<script setup lang="ts">
import ArtisanDetails from '~/components/artisans/ArtisanDetails.vue'

const { setHeader } = useHeader()

setHeader(
  'Detalhes do Artesão',
  'Esta é a página de detalhes do artesão. Aqui você pode ver todas as informações sobre o artesão selecionado.',
)

definePageMeta({
  layout: 'logged',
})
</script>

<template>
  <div>
    <ArtisanDetails />
  </div>
</template>

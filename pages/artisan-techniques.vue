<template>
  <ArtisanTechniques />
</template>

<script lang="ts" setup>
import ArtisanTechniques from '~/components/artisanTechniques/ArtisanTechniques.vue'

const { setHeader } = useHeader()
setHeader('Técnicas Artesanais', 'Esta é a página destinada às possíveis técnicas dos artesãos')

definePageMeta({ layout: 'logged' })
</script>

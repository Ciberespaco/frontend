<template>
  <Artisans />
</template>

<script setup lang="ts">
import Artisans from '~/components/artisans/Artisans.vue'

const { setHeader } = useHeader()

setHeader(
  'Artesãos',
  'Esta é a página de artesãos. Aqui você pode ver e gerenciar todos os artesãos cadastrados.',
)
definePageMeta({
  layout: 'logged',
})
</script>

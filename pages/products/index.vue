<template>
  <Products />
</template>

<script setup lang="ts">
import Products from '~/components/products/Products.vue'

const { setHeader } = useHeader()

setHeader(
  'Produtos',
  'Esta é a página de produtos. Aqui você pode ver e gerenciar todos os produtos cadastrados.',
)
definePageMeta({
  layout: 'logged',
})
</script>

<script setup lang="ts">
import ProductDetails from '~/components/products/ProductDetails.vue'

const { setHeader } = useHeader()

setHeader(
  'Detalhes do Produto',
  'Esta é a página de detalhes do produto. Aqui você pode ver todas as informações sobre o produto selecionado.',
)

definePageMeta({
  layout: 'logged',
})
</script>

<template>
  <div>
    <ProductDetails />
  </div>
</template>

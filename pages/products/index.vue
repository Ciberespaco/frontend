<template>
  <Products />
</template>

<script setup lang="ts">
import Products from '~/components/products/Products.vue'
import { useArtisansStore } from '~/stores/useArtisansStore'
import { useRawMaterials } from '~/composables/useRawMaterials'
import { userProductCategory } from '~/composables/useProductCategory'
import { useArtisanTechniques } from '~/composables/useArtisanTechniques'

const { setHeader } = useHeader()

setHeader(
  'Produtos',
  'Esta é a página de produtos. Aqui você pode ver e gerenciar todos os produtos cadastrados.',
)

// Initialize all stores for select components
const artisansStore = useArtisansStore()
const { fetchRawMaterials } = useRawMaterials()
const { fetchProductCategory } = userProductCategory()
const { fetchArtisanTechniques } = useArtisanTechniques()

onMounted(async () => {
  // Load all data needed for the product form selects
  await Promise.all([
    artisansStore.initialize(),
    fetchRawMaterials(),
    fetchProductCategory(),
    fetchArtisanTechniques(),
  ])
})

definePageMeta({
  layout: 'logged',
})
</script>

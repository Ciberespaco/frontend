<template>
  <ProductCategory />
</template>

<script lang="ts" setup>
import ProductCategory from '~/components/ProductCategory/ProductCategory.vue'

const { setHeader } = useHeader()

setHeader('Categoria de Produtos', 'Esta é a página de categoria de produtos')

definePageMeta({ layout: 'logged' })
</script>

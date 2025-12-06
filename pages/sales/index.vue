<template>
  <Sales />
</template>

<script lang="ts" setup>
import Sales from '~/components/sales/Sales.vue'

const { setHeader } = useHeader()

setHeader('Pedidos', 'Veja os pedidos realizados')

definePageMeta({ layout: 'logged' })
</script>

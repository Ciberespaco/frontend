<template>
  <Sales />
</template>

<script lang="ts" setup>
import Sales from '~/components/sales/Sales.vue'

const { setHeader } = useHeader()

setHeader('Vendas', 'Veja as vendaas realizadas')

definePageMeta({ layout: 'logged' })
</script>

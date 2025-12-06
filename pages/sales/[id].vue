<template>
  <SalesDetails />
</template>

<script lang="ts" setup>
import SalesDetails from '~/components/sales/SalesDetails.vue'

const { setHeader } = useHeader()

setHeader('Detalhes do pedido', 'verifique seus pedidos realizados')

definePageMeta({ layout: 'logged' })
</script>

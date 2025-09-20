<template>
  <SalesDetails />
</template>

<script lang="ts" setup>
import SalesDetails from '~/components/sales/SalesDetails.vue'

const { setHeader } = useHeader()

setHeader('Detalhes da venda', 'verifique suas vendas realizadas')

definePageMeta({ layout: 'logged' })
</script>

<template>
  <Pdv />
</template>

<script lang="ts" setup>
import Pdv from '~/components/pdv/Pdv.vue';

const { setHeader } = useHeader()

setHeader('Ponto de Venda', 'Crie novas vendas')

definePageMeta({ layout: 'logged' })
</script>

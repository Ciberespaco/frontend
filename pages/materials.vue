<template>
  <RawMaterials />
</template>

<script lang="ts" setup>
import RawMaterials from '~/components/RawMaterials/RawMaterials.vue'

const { setHeader } = useHeader()

setHeader('Materiais', 'Esta é a página de materiais dos produtos')

definePageMeta({ layout: 'logged' })
</script>

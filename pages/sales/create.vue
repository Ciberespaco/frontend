<template>
  <Pdv class="h-full" />
</template>

<script lang="ts" setup>
import Pdv from '~/components/pdv/Pdv.vue'

const { setHeader } = useHeader()

setHeader('', '')

definePageMeta({ layout: 'logged' })
</script>

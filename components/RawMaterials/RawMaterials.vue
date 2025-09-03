<template>
  <RawMaterialsCreateModal @submit-success="onRawMaterialCreated" />
  <RawMaterialsList ref="rawMaterialsListComponent" />
</template>

<script lang="ts" setup>
import RawMaterialsList from './RawMaterialsList.vue'
import RawMaterialsCreateModal from './RawMaterialsCreateModal.vue'

const rawMaterialsListComponent = ref()

const onRawMaterialCreated = () => {
  rawMaterialsListComponent.value.refresh()
}
</script>

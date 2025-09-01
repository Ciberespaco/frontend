<template>
  <div class="space-y-2">
    <ItemLabel>{{ label }}</ItemLabel>
    <ItemValue
      :variant="variant"
      :mono="mono"
    >
      <slot>{{ value }}</slot>
    </ItemValue>
  </div>
</template>

<script lang="ts" setup>
import ItemLabel from './ItemLabel.vue'
import ItemValue from './ItemValue.vue'

defineProps<{
  label: string
  value?: string
  variant?: 'default' | 'badge'
  mono?: boolean
}>()
</script>

<template>
  <div class="flex gap-4 justify-end">
    <Button
      variant="outline"
      class="px-8"
      @click="$emit('cancel')"
    >
      Cancelar Venda
    </Button>

    <Button
      :disabled="!canFinalize"
      class="px-8"
      @click="$emit('finalize')"
    >
      Finalizar Venda
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits(['cancel', 'finalize'])

defineProps<{
  canFinalize: boolean
}>()
</script>

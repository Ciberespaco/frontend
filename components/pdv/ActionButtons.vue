<template>
  <div class="flex gap-4 justify-end">
    <Button variant="outline" @click="$emit('cancel')" class="px-8">
      Cancelar Venda
    </Button>
    <Button @click="$emit('finalize')" class="px-8">
      Finalizar Venda
    </Button>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'

defineEmits(['cancel', 'finalize'])
</script>
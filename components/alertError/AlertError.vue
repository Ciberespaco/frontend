<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const { message } = defineProps({
  message: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Alert variant="destructive">
    <AlertCircle class="w-4 h-4" />
    <AlertTitle>Ops, ocorreu um erro...</AlertTitle>
    <AlertDescription> Descrição: {{ message }} </AlertDescription>
  </Alert>
</template>

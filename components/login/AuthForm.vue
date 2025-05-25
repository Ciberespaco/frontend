<script setup lang="ts">
import { Button } from '@/components/ui/button'
import AlertError from '../alertError/AlertError.vue';

defineProps<{
  title: string
  subtitle: string
  submitLabel: string
  loading: boolean
  apiError: string | null
  secondaryHref: string
  secondaryLabel: string
  onSubmit: (e?: Event) => unknown
}>()
</script>

<template>
  <form class="mx-auto grid w-[350px] gap-6" @submit="onSubmit">
    <AlertError v-if="apiError" type="error" :message="apiError" class="mb-4" />

    <div class="grid gap-2 text-center">
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="text-balance text-muted-foreground">{{ subtitle }}</p>
    </div>

    <slot />

    <Button type="submit" class="w-full" :disabled="loading">
      {{ loading ? submitLabel + '…' : submitLabel }}
    </Button>

    <p class="mt-4 text-center text-sm">
      {{ title === 'Login' ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
      <a :href="secondaryHref" class="underline">{{ secondaryLabel }}</a>
    </p>
  </form>
</template>
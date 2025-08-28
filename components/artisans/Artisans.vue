<template>
  <!-- Header com Título -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Artesãos</h1>
      <p class="text-muted-foreground mt-2">
        Gerencie os artesãos cadastrados no sistema
      </p>
    </div>
    <Button class="flex items-center gap-2">
      <Plus class="h-4 w-4" />
      Novo Artesão
    </Button>
    <ArtisansList />
  </div>
</template>
<script setup lang="ts">
import { ArtisansList } from "@/components/artisans/ArtisansList.vue";
</script>

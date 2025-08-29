<template>
  <!-- Header com Título -->
  <div class="flex flex-col h-screen px-8 py-16">
    <span class="flex flex-col mb-8">
      <Title>Artesãos</Title>
      <p class="text-lg text-zinc-600">
        Esta é a página de artesãos. Onde você pode ver todos os artesãos
        cadastrados.
      </p>
    </span>
    <ArtisansList />
  </div>
</template>
<script setup lang="ts">
import Title from "../basic/Title.vue";
import ArtisansList from "./ArtisansList.vue";
</script>

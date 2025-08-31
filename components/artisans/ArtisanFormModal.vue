<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="outline"> Cadastrar Novo Artesão </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Artesão</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo artesão ao sistema.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto max-h-[70vh] pr-6">
        <ArtisanForm @submit-success="handleFormSuccess" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import ArtisanForm from "./ArtisanForm.vue";
const emit = defineEmits(["submit-success"]);

const isOpen = ref(false);

function handleFormSuccess() {
  isOpen.value = false;
  emit("submit-success");
}
</script>

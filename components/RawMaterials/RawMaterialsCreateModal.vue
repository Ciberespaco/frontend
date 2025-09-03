<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button
        variant="outline"
        class="mb-4"
      >
        Cadastrar Novo Material
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Material</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo material ao sistema.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto max-h-[70vh] pr-6">
        <RawMaterialsCreateForm @submit-success="onFormSubmitSuccess" />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import RawMaterialsCreateForm from './RawMaterialsCreateForm.vue'

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

const onFormSubmitSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}
</script>

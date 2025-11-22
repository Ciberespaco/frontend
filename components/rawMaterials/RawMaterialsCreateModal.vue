<template>
  <Dialog
    :open="open"
    @update:open="setOpen"
  >
    <DialogTrigger as-child>
      <Button>
        <Plus class="w-4 h-4 mr-2" />
        Nova Matéria-prima
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Matéria-prima</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar uma nova matéria-prima.
        </DialogDescription>
      </DialogHeader>
      <RawMaterialsCreateForm @submit-success="onSuccess" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-vue-next'
import RawMaterialsCreateForm from './RawMaterialsCreateForm.vue'

const open = ref(false)
const emit = defineEmits(['submit-success'])

const setOpen = (value: boolean) => {
  open.value = value
}

const onSuccess = () => {
  setOpen(false)
  emit('submit-success')
}
</script>

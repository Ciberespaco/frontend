<template>
  <Dialog
    :open="open"
    @update:open="setOpen"
  >
    <DialogTrigger as-child>
      <Button
        variant="outline"
        size="icon"
      >
        <Pencil class="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
      <DialogHeader class="p-6 pb-4 flex-none">
        <DialogTitle>Editar Artesão</DialogTitle>
        <DialogDescription>
          Faça as alterações necessárias nos dados do artesão.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto p-6 pt-0">
        <ArtisanEditForm
          form-id="edit-artisan-form"
          :hide-button="true"
          :artisan="artisan"
          @submit-success="onSuccess"
        />
      </div>

      <div class="p-4 border-t bg-white flex justify-end flex-none">
        <Button
          type="submit"
          form="edit-artisan-form"
        >
          Salvar Alterações
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ArtisanEditForm from './ArtisanEditForm.vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Pencil } from 'lucide-vue-next'
import type { Artisan } from '@/composables/useArtisans'

const props = defineProps<{
  artisan: Artisan
}>()

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

function handleFormSuccess() {
  isOpen.value = false
  emit('submit-success')
}
</script>

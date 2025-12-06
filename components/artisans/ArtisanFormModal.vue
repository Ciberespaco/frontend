<template>
  <Dialog
    :open="open"
    @update:open="setOpen"
  >
    <DialogTrigger as-child>
      <Button class="cursor-pointer">
        <Plus class="w-4 h-4 mr-2" />
        Novo Artesão (F2)
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
      <DialogHeader class="p-6 pb-4 flex-none">
        <DialogTitle>Cadastrar Artesão</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar um novo artesão.
        </DialogDescription>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto p-6 pt-0">
        <ArtisanForm
          form-id="create-artisan-form"
          :hide-button="true"
          submit-text="Cadastrar"
          @submit="onSubmit"
        />
      </div>

      <div class="p-4 border-t bg-white flex justify-end flex-none">
        <Button
          type="submit"
          form="create-artisan-form"
        >
          Cadastrar
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import ArtisanForm from './ArtisanForm.vue'
import { useArtisans } from '~/composables/useArtisans'
import type { ArtisanSchema } from '~/lib/schemas/artisan.schema'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const open = ref(false)
const { createArtisan } = useArtisans()
const emit = defineEmits(['submit-success'])

const setOpen = (value: boolean) => {
  open.value = value
}

const onSubmit = async (values: ArtisanSchema) => {
  try {
    await createArtisan(values)
    showSuccessToast('Artesão cadastrado com sucesso!')
    setOpen(false)
    emit('submit-success')
  }
  catch (err: unknown) {
    ShowCrudErrorAlert('artesão', 'criar', String(err))
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'F2') {
    event.preventDefault()
    setOpen(true)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

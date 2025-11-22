<template>
  <Dialog
    :open="open"
    @update:open="setOpen"
  >
    <DialogTrigger as-child>
      <Button class="cursor-pointer">
        <Plus class="w-4 h-4 mr-2" />
        Novo Artesão
      </Button>
    </DialogTrigger>
    <DialogContent class="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Cadastrar Artesão</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para cadastrar um novo artesão.
        </DialogDescription>
      </DialogHeader>

      <ArtisanForm
        submit-text="Cadastrar"
        @submit="onSubmit"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
</script>

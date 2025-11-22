<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button>
        <Plus class="w-4 h-4 mr-2" />
        Novo Método de Pagamento
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Cadastrar Método de Pagamento</DialogTitle>
        <DialogDescription>
          Preencha os dados para cadastrar um novo método de pagamento.
        </DialogDescription>
      </DialogHeader>
      <PaymentMethodsCreateForm @submit-success="handleSuccess" />
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import PaymentMethodsCreateForm from './PaymentMethodsCreateForm.vue'

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

const handleSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}
</script>

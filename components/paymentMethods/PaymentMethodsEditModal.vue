<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="ghost" size="icon">
        <Pencil class="w-4 h-4" />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Método de Pagamento</DialogTitle>
        <DialogDescription>
          Atualize os dados do método de pagamento.
        </DialogDescription>
      </DialogHeader>
      <PaymentMethodsEditForm
        :payment-method="paymentMethod"
        @submit-success="handleSuccess"
      />
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Pencil } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import PaymentMethodsEditForm from './PaymentMethodsEditForm.vue'
import type { PaymentMethod } from '~/composables/usePaymentMethods'

defineProps<{
  paymentMethod: PaymentMethod
}>()

const emit = defineEmits(['submit-success'])

const isOpen = ref(false)

const handleSuccess = () => {
  isOpen.value = false
  emit('submit-success')
}
</script>

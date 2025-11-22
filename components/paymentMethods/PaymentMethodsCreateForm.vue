<template>
  <AutoForm
    :schema="PaymentMethodSchema"
    :field-config="fieldConfig"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit" class="mt-4">
      Cadastrar
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { PaymentMethodSchema } from '~/lib/schemas/payment-method.schema'
import type z from 'zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { usePaymentMethods } from '~/composables/usePaymentMethods'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'

const emit = defineEmits(['submit-success'])

const { createPaymentMethod } = usePaymentMethods()

const fieldConfig = {
  name: {
    label:  'Nome',
    inputProps: {
      placeholder: 'Ex: Dinheiro, Cartão de Crédito...',
    },
  },
  fee: {
    label: 'Taxa (%)',
    inputProps: {
      type: 'number',
      step: '0.01',
      min: '0',
      placeholder: '0.00',
    },
  },
}

const onSubmit = async (data: z.infer<typeof PaymentMethodSchema>) => {
  try {
    await createPaymentMethod(data)
    showSuccessToast('Método de pagamento cadastrado com sucesso!')
    emit('submit-success')
  }
  catch (error) {
    ShowCrudErrorAlert(error)
  }
}
</script>

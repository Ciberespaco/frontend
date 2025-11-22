<template>
  <AutoForm
    :schema="PaymentMethodSchema"
    :field-config="fieldConfig"
    :form="form"
    class="space-y-4"
    @submit="onSubmit"
  >
    <Button type="submit" class="mt-4">
      Salvar
    </Button>
  </AutoForm>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { PaymentMethodSchema } from '~/lib/schemas/payment-method.schema'
import type z from 'zod'
import AutoForm from '../ui/auto-form/AutoForm.vue'
import Button from '../ui/button/Button.vue'
import { usePaymentMethods, type PaymentMethod } from '~/composables/usePaymentMethods'
import { showSuccessToast, ShowCrudErrorAlert } from '~/lib/swal'
import { formatError } from '~/lib/utils'

const props = defineProps<{
  paymentMethod: PaymentMethod
}>()

const emit = defineEmits(['submit-success'])

const { updatePaymentMethod } = usePaymentMethods()

const form = useForm({
  validationSchema: toTypedSchema(PaymentMethodSchema),
})

const fieldConfig = {
  name: {
    label: 'Nome',
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

watch(() => props.paymentMethod, (newValue) => {
  if (newValue) {
    form.setValues({
      name: newValue.name,
      fee: newValue.fee,
    })
  }
}, { immediate: true, deep: true })

const onSubmit = async (data: z.infer<typeof PaymentMethodSchema>) => {
  try {
    await updatePaymentMethod(props.paymentMethod.id, data)
    showSuccessToast('Método de pagamento atualizado com sucesso!')
    emit('submit-success')
  }
  catch (error) {
    ShowCrudErrorAlert('Método de Pagamento', 'atualizar', formatError(error))
  }
}
</script>

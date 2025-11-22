<template>
  <div class="space-y-4">
    <div class="flex justify-start">
      <PaymentMethodsCreateModal @submit-success="handleRefresh" />
    </div>
    <PaymentMethodsList ref="listRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaymentMethodsList from '~/components/paymentMethods/PaymentMethodsList.vue'
import PaymentMethodsCreateModal from '~/components/paymentMethods/PaymentMethodsCreateModal.vue'
import { useHeader } from '~/composables/useHeader'

definePageMeta({
  layout: 'logged',
})

const { setHeader } = useHeader()
setHeader('Métodos de Pagamento', 'Gerencie os métodos de pagamento disponíveis')

const listRef = ref<InstanceType<typeof PaymentMethodsList> | null>(null)

const handleRefresh = () => {
  listRef.value?.refresh()
}
</script>

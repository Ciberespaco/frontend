<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <ProductTable :items="items" />
        <SaleProductForm />
      </div>

      <div class="space-y-6">
        <SummaryPanel :subtotal="subtotal" />
        <ActionButtons @cancel="handleCancel" @finalize="handleFinalize" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductTable from './ProductTable.vue'
import SummaryPanel from './SummaryPanel.vue'
import ActionButtons from './ActionButtons.vue'
import SaleProductForm from './SaleProductForm.vue'


const lastProductRef = ref(null)

const subtotal = computed(() => {
  return items.value.reduce((total, item) => total + item.subtotal, 0)
})

const handleSearch = (query) => {
  console.log('Pesquisando por:', query)
}

const handleAddProduct = (codigo) => {
  console.log('Adicionando produto com código:', codigo)
}

const handleCancel = () => {
  console.log('Cancelando venda')
  items.value = []
}

const handleFinalize = () => {
  console.log('Finalizando venda')
  console.log('Itens:', items.value)
  console.log('Último produto:', lastProductRef.value?.product)
}
</script>
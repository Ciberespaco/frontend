<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { Input } from '@/components/ui/input'
import { useProductSearch, type ProductSearched } from '~/composables/useProductSearch'
import AutoFormLabel from '@/components/ui/auto-form/AutoFormLabel.vue'
import { formatCurrency } from '~/lib/utils'

const props = defineProps<FieldProps & { initialSearch?: string }>()

const searchTerm = ref('')
const searchTrigger = ref('')
const showDropdown = ref(false)
const selectedProduct = ref<ProductSearched | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(-1)

const { data: products, pending } = useProductSearch(searchTrigger)

let timeout: NodeJS.Timeout | null = null

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})

// Watch for initial search and auto-focus
watch(() => props.initialSearch, (newValue) => {
  if (newValue && inputRef.value) {
    searchTerm.value = newValue
    showDropdown.value = true
    inputRef.value.focus()
  }
}, { immediate: true })

watch(searchTerm, (newValue, oldValue) => {
  if (timeout) clearTimeout(timeout)

  if (newValue === '') {
    searchTrigger.value = ''
    showDropdown.value = false
    selectedIndex.value = -1
    return
  }

  // Only show dropdown if user is actually typing (value changed)
  if (newValue !== oldValue) {
    showDropdown.value = true
    selectedIndex.value = -1
  }
  
  timeout = setTimeout(() => {
    searchTrigger.value = newValue
  }, 300)
})

// Reset selected index when products change
watch(products, () => {
  selectedIndex.value = -1
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSelect(componentField: any, product: ProductSearched) {
  selectedProduct.value = product
  searchTerm.value = product.name
  showDropdown.value = false
  selectedIndex.value = -1
  componentField.onChange(product)
}

const displayText = computed(() => {
  return selectedProduct.value ? selectedProduct.value.name : searchTerm.value
})

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
    selectedIndex.value = -1
  }, 200)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleKeyDown(event: KeyboardEvent, componentField: any) {
  // Close dropdown on Tab to allow navigation to next field
  if (event.key === 'Tab') {
    showDropdown.value = false
    selectedIndex.value = -1
    return
  }

  if (!showDropdown.value || !products.value?.length) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, products.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && products.value[selectedIndex.value]) {
        handleSelect(componentField, products.value[selectedIndex.value])
      }
      break
    case 'Escape':
      event.preventDefault()
      showDropdown.value = false
      selectedIndex.value = -1
      break
  }
}
</script>

<template>
  <FormField
    v-slot="{ componentField }"
    :name="fieldName"
  >
    <FormItem>
      <AutoFormLabel
        v-if="!config?.hideLabel"
        :required="required"
      >
        {{ config?.label }}
      </AutoFormLabel>
      <FormControl>
        <div class="relative">
          <Input
            ref="inputRef"
            v-model="searchTerm"
            type="text"
            placeholder="Digite para buscar um produto..."
            autocomplete="off"
            @blur="handleBlur"
            @keydown="(e: KeyboardEvent) => handleKeyDown(e, componentField)"
          />
          
          <!-- Dropdown com resultados -->
          <div
            v-if="showDropdown && (products?.length || pending)"
            class="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            <div
              v-if="pending"
              class="px-4 py-3 text-sm text-gray-500"
            >
              Buscando...
            </div>
            <div
              v-else-if="!products?.length"
              class="px-4 py-3 text-sm text-gray-500"
            >
              Nenhum produto encontrado.
            </div>
            <button
              v-for="(product, index) in products"
              :key="product.id"
              type="button"
              :class="[
                'w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                index === selectedIndex && 'bg-blue-50 border-l-2 border-blue-500'
              ]"
              @click="handleSelect(componentField, product)"
            >
              <div class="flex justify-between items-center">
                <div class="font-medium">{{ product.name }}</div>
                <div class="text-sm font-semibold text-gray-700">
                  {{ formatCurrency(product.price / 100) }}
                </div>
              </div>
              <div class="text-xs text-gray-500">
                Estoque: {{ product.quant }}
              </div>
            </button>
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

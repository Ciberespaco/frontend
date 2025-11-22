<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProductSearch, type ProductSearched } from '~/composables/useProductSearch'
import AutoFormLabel from '@/components/ui/auto-form/AutoFormLabel.vue'

const props = defineProps<FieldProps & { initialSearch?: string }>()

const open = ref(false)
const searchTerm = ref('')
const searchTrigger = ref('')

const { data: products, pending } = useProductSearch(searchTrigger)

let timeout: NodeJS.Timeout | null = null

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})

// Watch for initial search prop
watch(() => props.initialSearch, (newValue) => {
  if (newValue) {
    searchTerm.value = newValue
    open.value = true
    
    // Focus on the input after the popover opens
    // Use setTimeout to give the popover time to render
    const focusInput = (attempts = 0) => {
      setTimeout(() => {
        const input = document.querySelector('[cmdk-input]') as HTMLInputElement
        if (input) {
          input.focus()
          // Set cursor at the end of the text
          input.setSelectionRange(newValue.length, newValue.length)
        } else if (attempts < 5) {
          // Retry if input not found yet (max 5 attempts)
          focusInput(attempts + 1)
        }
      }, 50 * (attempts + 1)) // Increase delay with each attempt
    }
    
    focusInput()
  }
}, { immediate: true })

watch(searchTerm, (newValue) => {
  if (timeout) clearTimeout(timeout)

  if (newValue === '') {
    searchTrigger.value = ''
    return
  }

  timeout = setTimeout(() => {
    searchTrigger.value = newValue
  }, 500)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleSelect(componentField: any, product: ProductSearched) {
  componentField.onChange(product)
  searchTerm.value = product.name
  open.value = false
}
</script>

<template>
  <FormField
    v-slot="{ componentField, value }"
    :name="fieldName"
  >
    <FormItem>
      <AutoFormLabel
        v-if="!config?.hideLabel"
        :required="required"
      >
        {{ config?.label }}
      </AutoFormLabel>
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              :class="cn(
                'w-full justify-between',
                !value && 'text-muted-foreground',
              )"
            >
              {{ value ? value.name : "Selecione um produto..." }}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent class="w-[--radix-popover-trigger-width] p-0">
          <Command :should-filter="false">
            <CommandInput
              v-model="searchTerm"
              placeholder="Buscar produto..."
            />
            <CommandList>
              <CommandEmpty class="py-3 text-muted-foreground text-sm">
                <span v-if="pending">Buscando...</span>
                <span v-else>Nenhum produto encontrado.</span>
              </CommandEmpty>
              <CommandGroup>
                <CommandItem
                  v-for="product in products"
                  :key="product.id"
                  :value="product.name"
                  @select="() => handleSelect(componentField, product)"
                >
                  {{ product.name }}
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

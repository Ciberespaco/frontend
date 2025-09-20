<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Check, ChevronsUpDown } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useProductSearch, type ProductSearched } from '~/composables/useProductSearch'

defineProps<FieldProps>()

const open = ref(false)
const searchTerm = ref('')
const searchTrigger = ref('')

const { data: products, pending } = useProductSearch(searchTrigger)

const debouncedSearch = useDebounceFn((value: string) => {
  searchTrigger.value = value
}, 500)

watch(searchTerm, debouncedSearch)

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
                !value && 'text-muted-foreground', // ✨ CORREÇÃO 3: Use 'value' aqui
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
              <CommandEmpty>
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
                  <Check
                    :class="cn(
                      'mr-2 h-4 w-4',
                      value?.id === product.id ? 'opacity-100' : 'opacity-0',
                    )"
                  />
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

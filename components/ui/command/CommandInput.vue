<script setup lang="ts">
import type { ListboxFilterProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { Search } from "lucide-vue-next"
import { ListboxFilter, useForwardProps } from "reka-ui"
import { computed, watch } from "vue"
import { cn } from "@/lib/utils"
import { useCommand } from "."

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ListboxFilterProps & {
  class?: HTMLAttributes["class"]
  modelValue?: string 
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

const delegatedProps = reactiveOmit(props, "class", "modelValue")

const forwardedProps = useForwardProps(delegatedProps)

const { filterState } = useCommand()

watch(() => props.modelValue, (newVal) => {
  if (newVal !== undefined && newVal !== filterState.search) {
    filterState.search = newVal
  }
}, { immediate: true })

const internalValue = computed({
  get: () => filterState.search,
  set: (val) => {
    filterState.search = val
    emits('update:modelValue', val)
  }
})
</script>

<template>
  <div
    data-slot="command-input-wrapper"
    class="flex h-12 items-center gap-2 border-b px-3"
  >
    <Search class="size-4 shrink-0 opacity-50" />
    <ListboxFilter
      v-bind="{ ...forwardedProps, ...$attrs }"
      v-model="internalValue"
      data-slot="command-input"
      auto-focus
      :class="cn('placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    />
  </div>
</template>
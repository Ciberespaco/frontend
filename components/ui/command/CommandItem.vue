<script setup lang="ts">
import type { ListboxItemEmits, ListboxItemProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit, useCurrentElement } from "@vueuse/core"
import { ListboxItem, useForwardPropsEmits, useId } from "reka-ui"
import { computed, onMounted, onUnmounted, ref } from "vue"
import { cn } from "@/lib/utils"
import { useCommand, useCommandGroup } from "."

const props = defineProps<ListboxItemProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<ListboxItemEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const id = useId()
const { filterState, allItems, allGroups, shouldFilter } = useCommand()
const groupContext = useCommandGroup()

const isRender = computed(() => {
  if (shouldFilter.value === false) {
    return true
  }

  if (!filterState.search) {
    return true
  }
  else {
    const filteredCurrentItem = filterState.filtered.items.get(id)
    return filteredCurrentItem !== undefined ? filteredCurrentItem > 0 : true
  }
})

const itemRef = ref()
const currentElement = useCurrentElement(itemRef)
onMounted(() => {
  if (!(currentElement.value instanceof HTMLElement))
    return

  const itemValue = props.value?.toString() ?? currentElement.value.textContent ?? ""
  allItems.value.set(id, itemValue)

  const groupId = groupContext?.id
  if (groupId) {
    if (!allGroups.value.has(groupId)) {
      allGroups.value.set(groupId, new Set([id]))
    }
    else {
      allGroups.value.get(groupId)?.add(id)
    }
  }
})
onUnmounted(() => {
  allItems.value.delete(id)
})
</script>

<template>
  <ListboxItem
    v-if="isRender"
    v-bind="forwarded"
    :id="id"
    ref="itemRef"
    data-slot="command-item"
    :class="cn(`data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-3 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`, props.class)"
    @select="() => {
      filterState.search = ''
    }"
  >
    <slot />
  </ListboxItem>
</template>

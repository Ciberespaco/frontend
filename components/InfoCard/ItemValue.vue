<template>
  <component
    :is="variant === 'badge' ? Badge : 'p'"
    :class="[variant === 'badge' ? badgeClass : textClass, mono && 'font-mono']"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { Badge } from "@/components/ui/badge";
import { computed } from "vue";

const props = defineProps<{
  variant?: "default" | "badge";
  mono?: boolean;
  badgeVariant?: "default" | "secondary";
}>();

const textClass = "text-gray-900 font-medium";
const badgeClass = computed(() => props.badgeVariant || "default");
</script>

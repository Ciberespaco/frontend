<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <component :is="icon" class="h-5 w-5" />
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <slot />
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

defineProps<{
  title: string;
  icon: any;
}>();
</script>

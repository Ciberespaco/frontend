<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSidebar } from '@/components/ui/sidebar'

interface NavItem {
  title: string
  route: string
  shortcut?: string
  [key: string]: any
}

const props = defineProps<{
  navItems: NavItem[]
}>()

const { toggleSidebar } = useSidebar()
const router = useRouter()

const handleKeyDown = (event: KeyboardEvent) => {
  // F1: Toggle Sidebar
  if (event.key === 'F1') {
    event.preventDefault()
    toggleSidebar()
    return
  }

  // Navigation Shortcuts: Alt + Shift + Number
  if (event.altKey && event.shiftKey) {
    // Check for Digit1 through Digit9
    const match = event.code.match(/^Digit(\d)$/)
    if (match) {
      const digit = parseInt(match[1])
      if (digit > 0 && digit <= props.navItems.length) {
        event.preventDefault()
        // Use 1-based index for shortcuts (1 -> index 0)
        const item = props.navItems[digit - 1]
        if (item) {
          router.push(item.route)
        }
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <slot />
</template>

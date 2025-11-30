<template>
  <!-- Sidebar Layout Container -->
  <SidebarProvider>
    <GlobalShortcuts :nav-items="navItems" />
    <!-- Left Sidebar with Navigation and Tasks -->
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="offcanvas"
    >
      <div class="h-full w-full flex flex-col bg-primary text-zinc-50">
        <SidebarHeader>
          <h1 class="px-4 py-2 text-lg font-bold">
            Artes e Sabores
          </h1>
        </SidebarHeader>

        <!-- Sidebar Scrollable Content -->
        <SidebarContent>
          <!-- Navigation Section -->
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem
                  v-for="(item, index) in navItems"
                  :key="item.title"
                >
                  <SidebarMenuButton as-child>
                    <NuxtLink
                      :to="item.route"
                      class="flex items-center gap-2 px-4 py-2 justify-between group"
                    >
                      <div class="flex items-center gap-2">
                        <component
                          :is="item.icon"
                          class="w-5 h-5"
                        />
                        <span>{{ item.title }}</span>
                      </div>
                      <span class="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity border rounded px-1">
                        {{ index + 1 }}
                      </span>
                    </NuxtLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <!-- User Info at Bottom -->
          <div class="mt-auto px-3 py-2">
            <SidebarSeparator class="mb-2" />
            <div
              class="flex items-center gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-muted transition hover:text-primary"
              @click="$router.push('/profile')"
            >
              <div class="flex flex-col">
                <p class="text-sm font-medium leading-none">
                  {{ authStore.user?.name || "Usuário" }}
                </p>
                <p class="text-xs leading-none">
                  {{ authStore.user?.email || "Email" }}
                </p>
              </div>
            </div>
          </div>
        </SidebarContent>
      </div>
    </Sidebar>

    <!-- Main Content Area -->
    <main class="flex-1 overflow-hidden flex flex-col">
      <!-- Mobile menu trigger (visible on small screens) -->
      <SidebarTrigger class="m-4 inline-block md:hidden" />
      <!-- Nuxt page outlet for the main content -->
      <div class="flex flex-col h-full px-8 py-16">
        <span
          v-if="title || description"
          class="flex flex-col mb-8"
        >
          <Title>{{ title }}</Title>
          <h6 class="text-lg text-zinc-600">
            {{ description }}
          </h6>
        </span>
        <section class="flex-1 min-h-0 flex flex-col">
          <NuxtPage />
        </section>
      </div>
    </main>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { House, ShoppingCart, Package, Users, Archive, PenLine, CreditCard, CircleHelp } from 'lucide-vue-next'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/useAuthStore'
import Title from '~/components/basic/Title.vue'
import { useHeader } from '~/composables/useHeader'

import GlobalShortcuts from '~/components/GlobalShortcuts.vue'

const { title, description } = useHeader()

const navItems = [
  { title: 'Home', route: '/', icon: House },
  { title: 'Pedidos', route: '/sales', icon: ShoppingCart },
  { title: 'Produtos', route: '/products', icon: Package },
  // { title: 'Usuários', route: '/usuarios', icon: Users }, // Comentado - rota não existe
  { title: 'Artesãos', route: '/artisans', icon: Users },
  { title: 'Materiais', route: '/materials', icon: Archive },
  { title: 'Categoria de Produtos', route: '/productcategory', icon: Archive },
  { title: 'Técnicas Artesanais', route: '/artisan-techniques', icon: PenLine },
  { title: 'Métodos de Pagamento', route: '/payment-methods', icon: CreditCard },
  { title: 'Ajuda / Atalhos', route: '/help', icon: CircleHelp },
]
const authStore = useAuthStore()
</script>

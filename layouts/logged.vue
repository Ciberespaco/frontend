<template>
  <!-- Sidebar Layout Container -->
  <SidebarProvider>
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
                  v-for="item in navItems"
                  :key="item.title"
                >
                  <SidebarMenuButton as-child>
                    <NuxtLink
                      :to="item.route"
                      class="flex items-center gap-2 px-4 py-2"
                    >
                      <component
                        :is="item.icon"
                        class="w-5 h-5"
                      />
                      <span>{{ item.title }}</span>
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
    <main class="flex-1">
      <!-- Mobile menu trigger (visible on small screens) -->
      <SidebarTrigger class="m-4 inline-block md:hidden" />
      <!-- Nuxt page outlet for the main content -->
      <div class="flex flex-col h-screen px-8 py-16">
        <span class="flex flex-col mb-8">
          <Title>{{ title }}</Title>
          <h6 class="text-lg text-zinc-600">
            {{ description }}
          </h6>
        </span>
        <section>
          <NuxtPage />
        </section>
      </div>
    </main>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { House, ShoppingCart, Package, Users, Archive, PenLine } from 'lucide-vue-next'
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
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/useAuthStore'
import Title from '~/components/basic/Title.vue'
import { useHeader } from '~/composables/useHeader'

const { title, description } = useHeader()

const navItems = [
  { title: 'Home', route: '/', icon: House },
  { title: 'Vendas', route: '/vendas', icon: ShoppingCart },
  { title: 'Produtos', route: '/products', icon: Package },
  // { title: 'Usuários', route: '/usuarios', icon: Users }, // Comentado - rota não existe
  { title: 'Artesãos', route: '/artisans', icon: Users },
  { title: 'Materiais', route: '/materials', icon: Archive },
  { title: 'Categoria de Produtos', route: '/productcategory', icon: Archive },
  { title: 'Técnicas Artesanais', route: '/artisan-techniques', icon: PenLine },
]
const authStore = useAuthStore()
</script>

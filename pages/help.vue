<script setup lang="ts">
import {
  Keyboard,
  LayoutDashboard,
  ShoppingCart,
  Plus,
  X,
  Check,
  Menu,
  Monitor,
  Command,
  LifeBuoy,
  Mail,
  Phone,
  Info
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Title from '@/components/basic/Title.vue'
import { useHeader } from '~/composables/useHeader'

const { setHeader } = useHeader()
setHeader('Ajuda e Atalhos', 'Guia rápido de teclas de atalho e funcionalidades do sistema.')

const shortcutCategories = [
  {
    title: 'Navegação Global',
    icon: Monitor,
    description: 'Atalhos disponíveis em todo o sistema',
    shortcuts: [
      { key: 'F1', description: 'Alternar visibilidade da barra lateral (Menu)', icon: Menu },
      { key: 'Alt + Shift + 1-9', description: 'Navegação rápida entre páginas do menu', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Balcão de Pedidos',
    icon: ShoppingCart,
    description: 'Agilize seus pedidos com estes atalhos',
    shortcuts: [
      { key: 'F2', description: 'Adicionar Produto (Abrir busca)', icon: Plus },
      { key: 'F4', description: 'Cancelar Pedido atual', icon: X },
      { key: 'F10', description: 'Finalizar Pedido (Ir para pagamento)', icon: Check },
      { key: 'Esc', description: 'Fechar janelas modais', icon: X },
    ]
  },
  {
    title: 'Gerenciamento',
    icon: Command,
    description: 'Atalhos para cadastros e listagens',
    shortcuts: [
      { key: 'F2', description: 'Novo Cadastro (Em telas de listagem)', icon: Plus },
      { key: 'Esc', description: 'Fechar formulários e janelas', icon: X },
    ]
  }
]

definePageMeta({
  layout: 'logged',
})
</script>

<template>
  <div class="space-y-6 container mx-auto p-4 md:p-6">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="category in shortcutCategories" :key="category.title" class="flex flex-col">
        <CardHeader>
          <div class="flex items-center gap-2 mb-2">
            <div class="p-2 bg-primary/10 rounded-lg">
              <component :is="category.icon" class="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle>{{ category.title }}</CardTitle>
          <CardDescription>{{ category.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex-1">
          <div class="space-y-4">
            <div
              v-for="shortcut in category.shortcuts"
              :key="shortcut.key"
              class="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium leading-none">
                  {{ shortcut.description }}
                </p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <kbd
                  class="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[12px] font-medium text-muted-foreground opacity-100 bg-white shadow-sm"
                >
                  {{ shortcut.key }}
                </kbd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Keyboard class="w-5 h-5" />
            Dicas de Uso
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4 text-sm text-muted-foreground">
          <p>
            • Os atalhos de navegação <strong>Alt + Shift + Número</strong> correspondem à ordem dos itens no menu lateral.
            Por exemplo, <strong>Alt + Shift + 1</strong> leva para a Home, <strong>Alt + Shift + 2</strong> para Pedidos, e assim por diante.
          </p>
          <p>
            • No Balcão de Pedidos, você pode começar a digitar o nome de um produto imediatamente para abrir a busca, sem precisar clicar em nada.
          </p>
          <p>
            • Use a tecla <strong>Tab</strong> para navegar entre campos de formulários rapidamente.
          </p>
        </CardContent>
      </Card>

      <div class="space-y-6">
  

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Info class="w-5 h-5" />
              Sobre o Sistema
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4 text-sm text-muted-foreground">
            <p><strong>Artes e Sabores Gestão</strong></p>
            <p>Versão 1.0.0</p>
            <p class="text-xs">Desenvolvido para otimizar sua gestão.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

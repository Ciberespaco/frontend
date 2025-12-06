<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showErrorAlert, showSuccessToast } from '@/lib/swal'
import { ChevronRight, FileText } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { generateProductsByCategoryReport } from '~/composables/reports/productsByCategoryReport'
import { generateSalesByArtisanReport } from '~/composables/reports/salesByArtisanReport'
import { generateSalesByPaymentMethodReport } from '~/composables/reports/salesByPaymentMethodReport'
import { generateSalesReceiptExcel } from '~/composables/reports/salesReceiptExcel'
import { generateSalesReport } from '~/composables/reports/salesReport'
import { generateStockReport } from '~/composables/reports/stockReport'
import { useHeader } from '~/composables/useHeader'
import { useReportData } from '~/composables/useReportData'
import type { DateRange, ExportFormat, ReportType } from '~/composables/useReports'
import { useReports } from '~/composables/useReports'

definePageMeta({
  layout: 'logged',
})

const { setHeader } = useHeader()
setHeader('Relatórios', 'Gere e exporte relatórios do sistema')

const { availableReports, exportFormats } = useReports()
const { fetchSalesMonthlyReport, fetchSalesByArtisanReport, fetchStockReport, fetchProductsByCategoryReport, loading: dataLoading } = useReportData()

const selectedReport = ref<ReportType | null>(null)
const selectedFormat = ref<ExportFormat>('pdf')
const dateRange = ref<DateRange>({
  start: '',
  end: '',
})
const isGenerating = ref(false)

// Filtrar relatórios por categoria
const reportsByCategory = computed(() => {
  const categories = [
    { id: 'sales', name: 'Vendas', icon: '💰' },
    { id: 'inventory', name: 'Estoque', icon: '📦' },
  ]

  return categories.map(category => ({
    ...category,
    reports: availableReports.value.filter(r => r.category === category.id),
  }))
})

const availableFormats = computed(() => {
  if (!selectedReport.value)
    return []
  return exportFormats.value.filter(fmt =>
    selectedReport.value!.formats.includes(fmt.id),
  )
})

const canGenerate = computed(() => {
  if (!selectedReport.value || !selectedFormat.value)
    return false
  if (selectedReport.value.requiresDateRange) {
    return dateRange.value.start && dateRange.value.end
  }
  return true
})

const generateReport = async () => {
  if (!canGenerate.value || !selectedReport.value)
    return

  isGenerating.value = true
  try {
    // Buscar dados conforme o tipo de relatório
    switch (selectedReport.value.id) {
      case 'vendas-mensal': {
        const reportData = await fetchSalesMonthlyReport(dateRange.value.start, dateRange.value.end)
        
        if (selectedFormat.value === 'excel') {
          // Gerar Excel
          await generateSalesReceiptExcel(reportData, {
            periodo: `${formatDateDisplay(dateRange.value.start)}-${formatDateDisplay(dateRange.value.end)}`,
          })
        } else {
          // Gerar PDF
          await generateSalesReport(reportData, selectedFormat.value, {
            periodo: `${formatDateDisplay(dateRange.value.start)}-${formatDateDisplay(dateRange.value.end)}`,
          })
        }
        break
      }
      case 'vendas-por-pagamento': {
        const reportData = await fetchSalesMonthlyReport(dateRange.value.start, dateRange.value.end)
        await generateSalesByPaymentMethodReport(reportData, {
          periodo: `${formatDateDisplay(dateRange.value.start)}-${formatDateDisplay(dateRange.value.end)}`,
        })
        break
      }
      case 'vendas-artesao': {
        const reportData = await fetchSalesByArtisanReport(dateRange.value.start, dateRange.value.end)
        await generateSalesByArtisanReport(reportData, selectedFormat.value, {
          periodo: `${formatDateDisplay(dateRange.value.start)}-${formatDateDisplay(dateRange.value.end)}`,
        })
        break
      }
      case 'estoque': {
        const stockData = await fetchStockReport('ACTIVE')
        await generateStockReport(stockData, selectedFormat.value)
        break
      }
      case 'produtos-categoria': {
        const categoryData = await fetchProductsByCategoryReport()
        await generateProductsByCategoryReport(categoryData, selectedFormat.value)
        break
      }
      default:
        throw new Error('Tipo de relatório não implementado')
    }

    showSuccessToast('Relatório gerado com sucesso!')
  }
  catch (error: any) {
    console.error('Erro ao gerar relatório:', error)
    showErrorAlert(error.message || 'Erro ao gerar relatório. Tente novamente.', 'Erro ao Gerar Relatório')
  }
  finally {
    isGenerating.value = false
  }
}

const formatDateDisplay = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

// Definir data padrão (mês atual)
const setCurrentMonth = () => {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  dateRange.value.start = firstDay.toISOString().split('T')[0]
  dateRange.value.end = lastDay.toISOString().split('T')[0]
}
</script>

<template>
  <div class="min-h-screen bg-background p-4 md:p-6">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-3 bg-primary/10 rounded-lg">
            <FileText class="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-foreground">Central de Relatórios</h1>
            <p class="text-muted-foreground">Selecione e exporte relatórios do sistema</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Seleção de Relatório -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Escolha o Relatório</CardTitle>
              <CardDescription>Selecione o tipo de relatório que deseja gerar</CardDescription>
            </CardHeader>
            <CardContent class="space-y-6">
              <div v-for="category in reportsByCategory" :key="category.id" class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="text-xl">{{ category.icon }}</span>
                  <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {{ category.name }}
                  </h3>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button
                    v-for="report in category.reports"
                    :key="report.id"
                    type="button"
                    @click="selectedReport = report"
                    :class="[
                      'p-4 border-2 rounded-lg cursor-pointer transition-all text-left hover:shadow-md',
                      selectedReport?.id === report.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/50',
                    ]"
                  >
                    <div class="flex items-start gap-3">
                      <span class="text-2xl">{{ report.icon }}</span>
                      <div class="flex-1">
                        <h3 class="font-semibold text-foreground">{{ report.name }}</h3>
                        <p class="text-sm text-muted-foreground mt-1">{{ report.description }}</p>
                      </div>
                      <ChevronRight
                        v-if="selectedReport?.id === report.id"
                        class="w-5 h-5 text-primary"
                      />
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Filtros -->
          <Card v-if="selectedReport?.requiresDateRange">
            <CardHeader>
              <CardTitle>Período</CardTitle>
              <CardDescription>Selecione o intervalo de datas para o relatório</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="startDate">Data Inicial</Label>
                  <Input id="startDate" v-model="dateRange.start" type="date" />
                </div>
                <div class="space-y-2">
                  <Label for="endDate">Data Final</Label>
                  <Input id="endDate" v-model="dateRange.end" type="date" />
                </div>
              </div>
              <div class="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  @click="setCurrentMonth"
                >
                  Definir mês atual
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Painel de Exportação -->
        <div class="lg:col-span-1">
          <Card class="sticky top-6">
            <CardHeader>
              <CardTitle>2. Exportar</CardTitle>
              <CardDescription>Escolha o formato de exportação</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label>Formato</Label>
                <div class="space-y-2">
                  <button
                    v-for="format in availableFormats"
                    :key="format.id"
                    type="button"
                    @click="selectedFormat = format.id"
                    :disabled="!selectedReport"
                    :class="[
                      'w-full p-3 border-2 rounded-lg transition-all flex items-center gap-3',
                      selectedFormat === format.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50',
                      !selectedReport && 'opacity-50 cursor-not-allowed',
                    ]"
                  >
                    <span class="text-xl">{{ format.icon }}</span>
                    <span class="font-medium text-foreground">{{ format.name }}</span>
                  </button>
                </div>
              </div>

              <Button
                class="w-full"
                size="lg"
                type="button"
                @click="generateReport"
                :disabled="!canGenerate || isGenerating || dataLoading"
              >
                <svg
                  v-if="!isGenerating && !dataLoading"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span v-if="isGenerating || dataLoading" class="inline-block animate-spin mr-2">
                  ⚙️
                </span>
                {{ isGenerating || dataLoading ? 'Gerando...' : 'Gerar Relatório' }}
              </Button>

              <p v-if="!selectedReport" class="text-sm text-muted-foreground text-center">
                Selecione um relatório primeiro
              </p>
              <p
                v-else-if="selectedReport.requiresDateRange && (!dateRange.start || !dateRange.end)"
                class="text-sm text-muted-foreground text-center"
              >
                Defina o período para continuar
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

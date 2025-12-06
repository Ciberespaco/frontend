import { ref } from 'vue'

export type ReportType = {
    id: string
    name: string
    description: string
    icon: string
    formats: ExportFormat[]
    requiresDateRange: boolean
    category: 'sales' | 'inventory' | 'financial' | 'general'
}

export type ExportFormat = 'pdf' | 'excel' | 'csv'

export type ExportFormatInfo = {
    id: ExportFormat
    name: string
    icon: string
    mimeType: string
}

export type DateRange = {
    start: string
    end: string
}

export type ReportGenerationOptions = {
    periodo?: string
    artisanId?: number
    categoryId?: number
    [key: string]: unknown
}

export const useReports = () => {
    const availableReports = ref<ReportType[]>([
        {
            id: 'vendas-mensal',
            name: 'Vendas Mensais',
            description: 'Relatório detalhado de vendas do mês',
            icon: '📊',
            formats: ['pdf', 'excel'],
            requiresDateRange: true,
            category: 'sales',
        },
        {
            id: 'vendas-por-pagamento',
            name: 'Vendas por Forma de Pagamento',
            description: 'Vendas agrupadas por método de pagamento',
            icon: '💳',
            formats: ['pdf'],
            requiresDateRange: true,
            category: 'sales',
        },
        {
            id: 'vendas-artesao',
            name: 'Vendas por Artesão',
            description: 'Vendas agrupadas por artesão',
            icon: '👥',
            formats: ['pdf'],
            requiresDateRange: true,
            category: 'sales',
        },
        {
            id: 'estoque',
            name: 'Controle de Estoque',
            description: 'Produtos em estoque e quantidades',
            icon: '📦',
            formats: ['pdf'],
            requiresDateRange: false,
            category: 'inventory',
        },
        {
            id: 'produtos-categoria',
            name: 'Produtos por Categoria',
            description: 'Listagem de produtos organizados por categoria',
            icon: '🏷️',
            formats: ['pdf'],
            requiresDateRange: false,
            category: 'inventory',
        },
    ])

    const exportFormats = ref<ExportFormatInfo[]>([
        { id: 'pdf', name: 'PDF', icon: '📄', mimeType: 'application/pdf' },
        { id: 'excel', name: 'Excel', icon: '📗', mimeType: 'application/vnd.ms-excel' },
        { id: 'csv', name: 'CSV', icon: '📋', mimeType: 'text/csv' },
    ])

    return {
        availableReports,
        exportFormats,
    }
}

import axios from 'axios'
import { formatError } from '~/lib/utils'

// Types baseados na API do backend
export type SalesMonthlyReportItem = {
    sale_id: number
    date: string
    artisan_code: string
    artisan_name: string
    product_id: number
    product_code: number
    product_name: string
    quantity: number
    unit_price: number
    subtotal: number
    payment_breakdown: {
        cartao: number
        pix: number
        dinheiro: number
    }
    payment_methods: string
    category: string
    seller: string
}

export type SalesMonthlyReport = {
    items: SalesMonthlyReportItem[]
    summary: {
        total_sales: number
        total_items: number
        total_revenue: number
        by_payment_method: {
            cartao: number
            pix: number
            dinheiro: number
        }
    }
    dateRange: {
        start?: string
        end?: string
    }
}

export type SalesByArtisanItem = {
    sale_id: number
    date: string
    product_code: number
    product_name: string
    quantity: number
    subtotal: number
    payment_methods: string
}

export type ArtisanReportData = {
    artisan: {
        id: number
        name: string
        municipal_seal: string
        cpf: string
    }
    sales: SalesByArtisanItem[]
    totals: {
        total_sales: number
        total_items: number
        total_revenue: number
    }
}

export type SalesByArtisanReport = {
    artisans: ArtisanReportData[]
    dateRange: {
        start?: string
        end?: string
    }
}

export type StockProduct = {
    id: number
    product_code: number
    barcode: string
    name: string
    price: number
    quant: number
    description: string | null
    obs: string | null
    status: string
    artisan: {
        id: number
        name: string
        municipal_seal: string
    }
    product_category: {
        id: number
        name: string
    }
    raw_material: {
        id: number
        name: string
    }
    artisanal_technique: {
        id: number
        name: string
    }
}

export type StockReport = {
    products: StockProduct[]
    summary: {
        total_products: number
        total_quantity: number
        total_value: number
        by_status: Record<string, number>
    }
}

export type ProductsByCategoryReport = {
    categories: {
        id: number
        name: string
        products: StockProduct[]
        stats: {
            total_products: number
            total_quantity: number
            total_value: number
            average_price: number
        }
    }[]
    summary: {
        total_categories: number
        total_products: number
    }
}

export const useReportData = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Busca relatório de vendas mensais do backend
     */
    const fetchSalesMonthlyReport = async (startDate?: string, endDate?: string): Promise<SalesMonthlyReport> => {
        loading.value = true
        error.value = null
        try {
            const params: any = {}
            if (startDate)
                params.startDate = startDate

            if (endDate)
                params.endDate = endDate

            const { data } = await axios.get<SalesMonthlyReport>('/reports/sales-monthly', { params })
            return data
        }
        catch (err: unknown) {
            error.value = formatError(err)
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Busca relatório de vendas por artesão
     */
    const fetchSalesByArtisanReport = async (startDate?: string, endDate?: string, artisanId?: number): Promise<SalesByArtisanReport> => {
        loading.value = true
        error.value = null
        try {
            const params: any = {}
            if (startDate)
                params.startDate = startDate

            if (endDate)
                params.endDate = endDate

            if (artisanId)
                params.artisanId = artisanId

            const { data } = await axios.get<SalesByArtisanReport>('/reports/sales-by-artisan', { params })
            return data
        }
        catch (err: unknown) {
            error.value = formatError(err)
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Busca relatório de estoque
     */
    const fetchStockReport = async (status?: string, categoryId?: number): Promise<StockReport> => {
        loading.value = true
        error.value = null
        try {
            const params: any = {}
            if (status)
                params.status = status

            if (categoryId)
                params.categoryId = categoryId

            const { data } = await axios.get<StockReport>('/reports/stock', { params })
            return data
        }
        catch (err: unknown) {
            error.value = formatError(err)
            throw err
        }
        finally {
            loading.value = false
        }
    }

    /**
     * Busca relatório de produtos por categoria
     */
    const fetchProductsByCategoryReport = async (categoryId?: number): Promise<ProductsByCategoryReport> => {
        loading.value = true
        error.value = null
        try {
            const params: any = {}
            if (categoryId)
                params.categoryId = categoryId

            const { data } = await axios.get<ProductsByCategoryReport>('/reports/products-by-category', { params })
            return data
        }
        catch (err: unknown) {
            error.value = formatError(err)
            throw err
        }
        finally {
            loading.value = false
        }
    }

    return {
        loading,
        error,
        fetchSalesMonthlyReport,
        fetchSalesByArtisanReport,
        fetchStockReport,
        fetchProductsByCategoryReport,
    }
}

import { defineStore } from 'pinia'
import axios from 'axios'
import { formatError } from '~/lib/utils'

interface Product {
    id: number
    name: string
    price: number
    product_code: number
    barcode: string
    status: string
    isActive: boolean
}

interface ProductApiResponse {
    id: number
    name: string
    price: number
    product_code: number
    barcode: string
    status: string
}

interface ProductListResponse {
    data: ProductApiResponse[]
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
}

interface ProductsState {
    products: Product[] | null
    loading: boolean
    error: string | null
}

export const useProductsStore = defineStore('products', {
    state: (): ProductsState => ({
        products: null,
        loading: false,
        error: null,
    }),

    actions: {
        async initialize() {
            if (this.products) {
                return
            }

            this.loading = true
            this.error = null
            try {
                const { data: response } = await axios.get<ProductListResponse>('/products?limit=100')

                const mappedData = response.data.map((productFromApi: ProductApiResponse) => ({
                    id: productFromApi.id,
                    name: productFromApi.name,
                    price: productFromApi.price,
                    product_code: productFromApi.product_code,
                    barcode: productFromApi.barcode,
                    status: productFromApi.status,
                    isActive: productFromApi.status === 'ACTIVE',
                }))

                this.products = mappedData
            }
            catch (err: unknown) {
                this.error = formatError(err)
                throw err
            }
            finally {
                this.loading = false
            }
        },

        async refresh() {
            this.products = null
            await this.initialize()
        },
    },
})

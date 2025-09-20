import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import axios from 'axios';

export interface ProductSearched {
  id: string;
  name: string;
  artisan: {
    name : string;
  }
  price: number;
}

export interface ProductApiResponse {
  data: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export const useProductSearch = (searchTerm: Ref<string>) => {
  const products = ref<Product[]>([]);
  const pending = ref(false);
  const error = ref<Error | null>(null);

  const fetchProducts = async () => {
    // DEBUG 4: Verificando se a função de busca é executada
    console.log(`[DEBUG-Composable] fetchProducts called. Term: "${searchTerm.value}"`);

    if (!searchTerm.value) {
      console.log('[DEBUG-Composable] Term is empty, skipping API call.');
      products.value = [];
      return;
    }

    pending.value = true;
    error.value = null;
    try {
      const params = {
        limit: 10,
        status: 'ACTIVE',
        name: searchTerm.value,
      };

      // DEBUG 5: Verificando os parâmetros exatos da requisição
      console.log('[DEBUG-Composable] Making API request with params:', params);

      const response = await axios.get<ProductApiResponse>('/products', { params });
      products.value = response.data.data;
    }
    catch (err) {
      console.error('[DEBUG-Composable] API call failed:', err);
      error.value = err as Error;
      products.value = [];
    }
    finally {
      pending.value = false;
    }
  };

  // DEBUG 3: Verificando se o watcher do composable é acionado
  watch(searchTerm, (newValue) => {
    console.log(`[DEBUG-Composable] Watcher triggered with: "${newValue}"`);
    fetchProducts();
  });

  return { data: products, pending, error };
};
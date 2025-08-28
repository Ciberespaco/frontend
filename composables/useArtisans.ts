import { ref, computed } from "vue";
import axios from "axios";
import { formatError } from "~/lib/utils";

interface Artisan {
  id: string;
  name: string;
  cpf: string;
  municipal_seal: string;
  sex: "M" | "F";
  birthdate: string;
  cep: string;
  house_number: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  artisan_register_date: string;
  created_at: string;
  exit_date: string | null;
  obs: string;
}

interface ArtisanListResponse {
  data: Artisan[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

interface ArtisanFilters {
  name?: string;
  cpf?: string;
  municipal_seal?: string;
  birthdateFrom?: string;
  birthdateTo?: string;
  artisanRegisterDateFrom?: string;
  artisanRegisterDateTo?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  exitDateFrom?: string;
  exitDateTo?: string;
  sex?: "M" | "F" | "";
  uf?: string;
  estado?: string;
  obs?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useArtisans() {
  const loading = ref(false);
  const artisans = ref<Artisan[]>([]);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalPages = ref(0);
  const error = ref<string | null>(null);
  const filters = ref<ArtisanFilters>({});

  const buildQueryParams = (
    page: number,
    limit: number,
    filterParams: ArtisanFilters = {}
  ) => {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("limit", limit.toString());

    // Adicionar filtros apenas se tiverem valor
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    return params.toString();
  };

  const fetchArtisans = async (
    page: number = 1,
    limit: number = 10,
    filterParams: ArtisanFilters = {}
  ) => {
    loading.value = true;
    error.value = null;

    try {
      const queryParams = buildQueryParams(page, limit, filterParams);
      const { data } = await axios.get<ArtisanListResponse>(
        `/artisan/list?${queryParams}`
      );

      artisans.value = data.data;
      totalItems.value = data.totalItems;
      currentPage.value = data.currentPage;
      itemsPerPage.value = data.itemsPerPage;
      totalPages.value = data.totalPages;
      filters.value = filterParams;
    } catch (err: unknown) {
      error.value = formatError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const refreshArtisans = () => {
    return fetchArtisans(currentPage.value, itemsPerPage.value, filters.value);
  };

  const applyFilters = (newFilters: ArtisanFilters) => {
    return fetchArtisans(1, itemsPerPage.value, newFilters);
  };

  const clearFilters = () => {
    filters.value = {};
    return fetchArtisans(1, itemsPerPage.value, {});
  };

  return {
    // State
    artisans: computed(() => artisans.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    totalItems: computed(() => totalItems.value),
    currentPage: computed(() => currentPage.value),
    itemsPerPage: computed(() => itemsPerPage.value),
    totalPages: computed(() => totalPages.value),
    filters: computed(() => filters.value),

    // Actions
    fetchArtisans,
    refreshArtisans,
    applyFilters,
    clearFilters
  };
}

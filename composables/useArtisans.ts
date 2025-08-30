import { ref, computed } from "vue";
import axios from "axios";
import { formatError } from "~/lib/utils";

export type Artisan = {
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
};

interface ArtisanListResponse {
  data: Artisan[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export function useArtisans() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const artisans = ref<Artisan[]>([]);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalPages = ref(0);
  const artisan = ref<Artisan | null>(null);

  const fetchArtisans = async (page: number = 1, limit: number = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get<ArtisanListResponse>(
        `/artisan/list?page=${page}&limit=${limit}`
      );
      artisans.value = data.data;
      totalItems.value = data.totalItems;
      currentPage.value = data.currentPage;
      itemsPerPage.value = data.itemsPerPage;
      totalPages.value = data.totalPages;
    } catch (err: unknown) {
      error.value = formatError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchArtisan = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await axios.get<Artisan>(`/artisan/${id}`);
      artisan.value = data;
    } catch (err: unknown) {
      error.value = formatError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteArtisan = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await axios.delete(`/artisan/${id}`);
    } catch (err: unknown) {
      error.value = formatError(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    artisans: computed(() => artisans.value),
    artisan: computed(() => artisan.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    totalItems: computed(() => totalItems.value),
    currentPage: computed(() => currentPage.value),
    totalPages: computed(() => totalPages.value),

    fetchArtisans,
    fetchArtisan,
    deleteArtisan
  };
}

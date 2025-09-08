import { useRawMaterials } from "./useRawMaterials"
import { useArtisansStore } from "#imports";

export const useProductFormOptions = () => {
  const artisansStore = useArtisansStore();
  const { rawMaterials, fetchRawMaterials } = useRawMaterials();
  const { artisanTechniques, fetchArtisanTechniques } = useArtisanTechniques();
  
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadFormOptions = async () => {
    loading.value = true;
    error.value = null;
      try {
      await Promise.all([
        artisansStore.initialize(),
        fetchRawMaterials(),
        fetchArtisanTechniques()
      ]);
    } catch (err: unknown) {
      error.value = error.value || 'Falha ao buscar as opções do formulário.';
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    loadFormOptions,
  }
}

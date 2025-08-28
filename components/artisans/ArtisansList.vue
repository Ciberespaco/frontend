<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useArtisans } from "@/composables/useArtisans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ArtisansFilters from "./ArtisansFilters.vue";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Edit,
  Trash2
} from "lucide-vue-next";

const {
  artisans,
  loading,
  error,
  totalItems,
  currentPage,
  totalPages,
  fetchArtisans,
  applyFilters,
  clearFilters
} = useArtisans();

const handleApplyFilters = (filters: any) => {
  applyFilters(filters);
};

const handleClearFilters = () => {
  clearFilters();
};

const handlePageChange = (page: number) => {
  fetchArtisans(page, 10);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
};

const formatCpf = (cpf: string | null) => {
  if (!cpf) return "-";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const getMainAddress = (addresses: any[]) => {
  if (!addresses || addresses.length === 0) return "-";
  const main = addresses[0];
  return `${main.street || ""} ${main.number || ""}, ${main.neighborhood || ""} - ${main.city || ""}`;
};

const getVisiblePages = () => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

onMounted(() => {
  fetchArtisans();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Filtros -->
    <ArtisansFilters
      :loading="loading"
      @apply-filters="handleApplyFilters"
      @clear-filters="handleClearFilters"
    />

    <!-- Error -->
    <div v-if="error" class="rounded-md bg-red-50 p-4 border border-red-200">
      <div class="text-sm text-red-800">
        {{ error }}
      </div>
    </div>

    <!-- Lista -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          <span>Lista de Artesãos</span>
          <span
            v-if="totalItems > 0"
            class="text-sm font-normal text-muted-foreground"
          >
            {{ totalItems }} artesãos encontrados
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div
            v-for="i in 5"
            :key="i"
            class="flex items-center space-x-4 p-4 border rounded-lg"
          >
            <Skeleton class="h-10 w-10 rounded-full" />
            <div class="space-y-2 flex-1">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
            <div class="flex space-x-2">
              <Skeleton class="h-8 w-8" />
              <Skeleton class="h-8 w-8" />
              <Skeleton class="h-8 w-8" />
            </div>
          </div>
        </div>

        <!-- Empty -->
        <div
          v-else-if="!artisans || artisans.length === 0"
          class="text-center py-12"
        >
          <div class="text-muted-foreground">Nenhum artesão encontrado</div>
        </div>

        <!-- Artesãos -->
        <div v-else class="space-y-4">
          <div
            v-for="artisan in artisans"
            :key="artisan.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-center space-x-4 flex-1">
              <div
                class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
              >
                <span class="text-sm font-medium text-primary">
                  {{ artisan.name?.charAt(0)?.toUpperCase() || "?" }}
                </span>
              </div>

              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-4">
                  <h3 class="font-medium">
                    {{ artisan.name || "Nome não informado" }}
                  </h3>
                  <span
                    v-if="artisan.municipal_seal"
                    class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    Selo: {{ artisan.municipal_seal }}
                  </span>
                </div>

                <div
                  class="flex items-center gap-6 text-sm text-muted-foreground"
                >
                  <span>CPF: {{ formatCpf(artisan.cpf) }}</span>
                  <span v-if="artisan.sex">
                    Sexo: {{ artisan.sex === "M" ? "Masculino" : "Feminino" }}
                  </span>
                  <span v-if="artisan.birthdate">
                    Nascimento: {{ formatDate(artisan.birthdate) }}
                  </span>
                </div>

                <div
                  v-if="artisan.localidade || artisan.uf"
                  class="text-sm text-muted-foreground"
                >
                  Endereço: {{ artisan.localidade || "" }} -
                  {{ artisan.uf || "" }}
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <Eye class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                <Edit class="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between mt-6 pt-6 border-t"
        >
          <div class="text-sm text-muted-foreground">
            Página {{ currentPage }} de {{ totalPages }} ({{
              totalItems
            }}
            artesãos no total)
          </div>

          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage <= 1 || loading"
              @click="handlePageChange(currentPage - 1)"
            >
              <ChevronLeft class="h-4 w-4" />
              Anterior
            </Button>

            <div class="flex items-center space-x-1">
              <!-- Primeira página -->
              <Button
                v-if="currentPage > 3"
                variant="outline"
                size="sm"
                @click="handlePageChange(1)"
              >
                1
              </Button>

              <!-- Reticências -->
              <span v-if="currentPage > 4" class="px-2 text-muted-foreground"
                >...</span
              >

              <!-- Páginas próximas -->
              <Button
                v-for="page in getVisiblePages()"
                :key="page"
                variant="outline"
                size="sm"
                :class="{
                  'bg-primary text-primary-foreground': page === currentPage
                }"
                @click="handlePageChange(page)"
              >
                {{ page }}
              </Button>

              <!-- Reticências -->
              <span
                v-if="currentPage < totalPages - 3"
                class="px-2 text-muted-foreground"
                >...</span
              >

              <!-- Última página -->
              <Button
                v-if="currentPage < totalPages - 2"
                variant="outline"
                size="sm"
                @click="handlePageChange(totalPages)"
              >
                {{ totalPages }}
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage >= totalPages || loading"
              @click="handlePageChange(currentPage + 1)"
            >
              Próxima
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

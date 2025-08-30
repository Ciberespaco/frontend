<script setup lang="ts">
import DataTable from "@/components/table/DataTable.vue";
import { type ColumnDef } from "@tanstack/table-core";
import { formatCpf, formatDate } from "~/lib/utils";
import { useArtisans, type Artisan } from "~/composables/useArtisans";
import { onMounted } from "vue";

const {
  artisans,
  loading,
  error,
  totalItems,
  currentPage,
  totalPages,
  fetchArtisans
} = useArtisans();

onMounted(() => {
  fetchArtisans();
});

const columns: ColumnDef<Artisan, any>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => row.getValue("name")
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => formatCpf(row.getValue("cpf"))
  },
  {
    accessorKey: "municipal_seal",
    header: "Selo Municipal",
    cell: ({ row }) => row.getValue("municipal_seal")
  },
  {
    accessorKey: "sex",
    header: "Sexo",
    cell: ({ row }) => (row.getValue("sex") === "F" ? "Feminino" : "Masculino")
  },
  {
    accessorKey: "birthdate",
    header: "Data de Nascimento",
    cell: ({ row }) => formatDate(row.getValue("birthdate"))
  },
  {
    accessorKey: "localidade",
    header: "Cidade",
    cell: ({ row }) => `${row.getValue("localidade")}/${row.getValue("uf")}`
  },
  {
    accessorKey: "artisan_register_date",
    header: "Data de Registro",
    cell: ({ row }) => formatDate(row.getValue("artisan_register_date"))
  }
];

const handleView = (artisan: Artisan) => {
  useRouter().push("/artisans/" + artisan.id);
};
</script>

<template>
  <div class="space-y-4">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center p-8">
      <div class="text-lg">Carregando...</div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded p-4">
      <p class="text-red-700">{{ error }}</p>
    </div>

    <!-- Data table -->
    <DataTable
      v-else
      :columns="columns"
      :data="artisans"
      :on-view="handleView"
    />

    <!-- Pagination info -->
    <div v-if="!loading && !error" class="text-sm text-gray-500">
      Total de artesãos: {{ totalItems }} | Página {{ currentPage }} de
      {{ totalPages }}
    </div>
  </div>
</template>

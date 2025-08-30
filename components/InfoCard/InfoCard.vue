<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <!-- Header com título e ações -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <p class="text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex gap-3">
        <Button
          @click="$emit('edit')"
          variant="outline"
          size="sm"
          class="flex items-center gap-2"
        >
          <Edit class="h-4 w-4" />
          Editar
        </Button>
        <Button
          @click="$emit('delete')"
          variant="destructive"
          size="sm"
          class="flex items-center gap-2"
        >
          <Trash2 class="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
        ></div>
        <span class="text-gray-600">Carregando...</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="artisan" class="space-y-6">
      Informações Pessoais
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <User class="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500"
              >Nome Completo</Label
            >
            <p class="text-gray-900 font-medium">{{ artisan.name }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">CPF</Label>
            <p class="text-gray-900 font-mono">{{ formatCPF(artisan.cpf) }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">Sexo</Label>
            <Badge :variant="artisan.sex === 'M' ? 'default' : 'secondary'">
              {{ artisan.sex === "M" ? "Masculino" : "Feminino" }}
            </Badge>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500"
              >Data de Nascimento</Label
            >
            <p class="text-gray-900">{{ formatDate(artisan.birthdate) }}</p>
          </div>
        </CardContent>
      </Card>

      Endereço
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <MapPin class="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">CEP</Label>
            <p class="text-gray-900 font-mono">{{ formatCEP(artisan.cep) }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">Número</Label>
            <p class="text-gray-900">{{ artisan.house_number }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">Bairro</Label>
            <p class="text-gray-900">{{ artisan.bairro }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">Cidade</Label>
            <p class="text-gray-900">{{ artisan.localidade }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500">Estado</Label>
            <p class="text-gray-900">{{ artisan.estado }} ({{ artisan.uf }})</p>
          </div>
        </CardContent>
      </Card>

      Informações do Registro
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5" />
            Informações do Registro
          </CardTitle>
        </CardHeader>
        <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500"
              >Selo Municipal</Label
            >
            <p class="text-gray-900 font-mono">{{ artisan.municipal_seal }}</p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500"
              >Data de Registro</Label
            >
            <p class="text-gray-900">
              {{ formatDate(artisan.artisan_register_date) }}
            </p>
          </div>
          <div class="space-y-2">
            <Label class="text-sm font-medium text-gray-500"
              >Data de Criação</Label
            >
            <p class="text-gray-900">
              {{ formatDateTime(artisan.created_at) }}
            </p>
          </div>
          <div class="space-y-2" v-if="artisan.exit_date">
            <Label class="text-sm font-medium text-gray-500"
              >Data de Saída</Label
            >
            <p class="text-gray-900">{{ formatDate(artisan.exit_date) }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Observações -->
      <Card v-if="artisan.obs">
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <MessageSquare class="h-5 w-5" />
            Observações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p class="text-gray-900 leading-relaxed">{{ artisan.obs }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-12">
      <div
        class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
      >
        <AlertCircle class="h-12 w-12 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Nenhum registro encontrado
      </h3>
      <p class="text-gray-600">
        {{ emptyMessage || "Não foi possível encontrar os dados solicitados." }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { onMounted, computed } from "vue";
import { useArtisans } from "@/composables/useArtisans";
import Swal from "sweetalert2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Edit,
  Trash2,
  User,
  MapPin,
  FileText,
  MessageSquare,
  AlertCircle
} from "lucide-vue-next";

defineEmits(["edit", "delete"]);

defineProps<{
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}>();

const route = useRoute();
const { fetchArtisan, artisan, loading, error } = useArtisans();

const formatCPF = (cpf: string) => {
  if (!cpf) return "";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatCEP = (cep: string) => {
  if (!cep) return "";
  return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
};

const formatDate = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR");
};

const formatDateTime = (date: string) => {
  if (!date) return "";
  return new Date(date).toLocaleString("pt-BR");
};

onMounted(() => {
  const artisanId = route.params.id;
  if (!artisanId) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: "ID do artesão não fornecido."
    });
    return;
  }
  fetchArtisan(artisanId as string);
  if (error.value) {
    Swal.fire({
      icon: "error",
      title: "Erro",
      text: error.value
    });
  }
});
</script>

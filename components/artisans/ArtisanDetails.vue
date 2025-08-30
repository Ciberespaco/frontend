<template>
  <div class="container mx-auto p-6 max-w-4xl">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ title }}</h1>
        <p class="text-gray-600 mt-1">{{ subtitle }}</p>
      </div>
      <div class="flex gap-3">
        <Button
          @click="handleEdit"
          variant="outline"
          size="sm"
          class="flex items-center gap-2"
        >
          <Edit class="h-4 w-4" />
          Editar
        </Button>
        <Button
          @click="handleDelete"
          variant="destructive"
          size="sm"
          class="flex items-center gap-2"
        >
          <Trash2 class="h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
        ></div>
        <span class="text-gray-600">Carregando...</span>
      </div>
    </div>

    <div v-else-if="artisan" class="space-y-6">
      <InfoCard title="Informações Pessoais" :icon="User">
        <InfoItem label="Nome Completo" :value="artisan.name" />
        <InfoItem label="CPF" :value="formatCpf(artisan.cpf)" mono />
        <InfoItem label="Sexo" variant="badge">
          <Badge :variant="artisan.sex === 'M' ? 'default' : 'secondary'">
            {{ artisan.sex === "M" ? "Masculino" : "Feminino" }}
          </Badge>
        </InfoItem>
        <InfoItem
          label="Data de Nascimento"
          :value="formatDate(artisan.birthdate)"
        />
      </InfoCard>

      <InfoCard title="Endereço" :icon="MapPin">
        <InfoItem label="CEP" :value="formatCEP(artisan.cep)" mono />
        <InfoItem label="Número" :value="artisan.house_number" />
        <InfoItem label="Bairro" :value="artisan.bairro" />
        <InfoItem label="Cidade" :value="artisan.localidade" />
        <InfoItem label="Estado" :value="`${artisan.estado} (${artisan.uf})`" />
      </InfoCard>

      <InfoCard title="Informações do Registro" :icon="FileText">
        <InfoItem label="Selo Municipal" :value="artisan.municipal_seal" mono />
        <InfoItem
          label="Data de Registro"
          :value="formatDate(artisan.artisan_register_date)"
        />
        <InfoItem
          label="Data de Criação"
          :value="formatDateTime(artisan.created_at)"
        />
        <InfoItem
          v-if="artisan.exit_date"
          label="Data de Saída"
          :value="formatDate(artisan.exit_date)"
        />
      </InfoCard>

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
import { onMounted } from "vue";
import { useArtisans } from "@/composables/useArtisans";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  User,
  MapPin,
  FileText,
  MessageSquare,
  AlertCircle
} from "lucide-vue-next";
import { formatCEP, formatCpf, formatDate, formatDateTime } from "~/lib/utils";
import InfoCard from "../InfoCard/InfoCard.vue";
import InfoItem from "../InfoCard/InfoItem.vue";

defineEmits(["edit", "delete"]);

defineProps<{
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}>();

const route = useRoute();
const { fetchArtisan, artisan, loading, error } = useArtisans();

const handleEdit = () => {
  Swal.fire({
    title: "Editar Artesão",
    text: "Ainda não implementado.",
    icon: "info",
    confirmButtonText: "Continuar",
    showCancelButton: true
  });
};

const handleDelete = () => {
  Swal.fire({
    title: "Deletar Artesão",
    text: "Ainda não implementado.",
    icon: "info",
    confirmButtonText: "Continuar",
    showCancelButton: true
  });
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

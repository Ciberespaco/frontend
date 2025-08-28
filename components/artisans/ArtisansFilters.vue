<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X, ChevronDown, ChevronUp } from "lucide-vue-next";

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

interface Props {
  loading?: boolean;
}

interface Emits {
  (e: "apply-filters", filters: ArtisanFilters): void;
  (e: "clear-filters"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

const isExpanded = ref(false);

const schema = toTypedSchema(
  z.object({
    name: z.string().optional(),
    cpf: z.string().optional(),
    municipal_seal: z.string().optional(),
    birthdateFrom: z.string().optional(),
    birthdateTo: z.string().optional(),
    artisanRegisterDateFrom: z.string().optional(),
    artisanRegisterDateTo: z.string().optional(),
    createdAtFrom: z.string().optional(),
    createdAtTo: z.string().optional(),
    exitDateFrom: z.string().optional(),
    exitDateTo: z.string().optional(),
    sex: z.enum(["M", "F", ""]).optional(),
    uf: z.string().optional(),
    estado: z.string().optional(),
    obs: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional()
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: "",
    cpf: "",
    municipal_seal: "",
    birthdateFrom: "",
    birthdateTo: "",
    artisanRegisterDateFrom: "",
    artisanRegisterDateTo: "",
    createdAtFrom: "",
    createdAtTo: "",
    exitDateFrom: "",
    exitDateTo: "",
    sex: "",
    uf: "",
    estado: "",
    obs: "",
    sortBy: "name",
    sortOrder: "asc"
  }
});

// Form fields
const { value: name } = useField<string>("name");
const { value: cpf } = useField<string>("cpf");
const { value: municipal_seal } = useField<string>("municipal_seal");
const { value: birthdateFrom } = useField<string>("birthdateFrom");
const { value: birthdateTo } = useField<string>("birthdateTo");
const { value: artisanRegisterDateFrom } = useField<string>(
  "artisanRegisterDateFrom"
);
const { value: artisanRegisterDateTo } = useField<string>(
  "artisanRegisterDateTo"
);
const { value: createdAtFrom } = useField<string>("createdAtFrom");
const { value: createdAtTo } = useField<string>("createdAtTo");
const { value: exitDateFrom } = useField<string>("exitDateFrom");
const { value: exitDateTo } = useField<string>("exitDateTo");
const { value: sex } = useField<string>("sex");
const { value: uf } = useField<string>("uf");
const { value: estado } = useField<string>("estado");
const { value: obs } = useField<string>("obs");
const { value: sortBy } = useField<string>("sortBy");
const { value: sortOrder } = useField<string>("sortOrder");

// Estados brasileiros
const estados = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" }
];

// Opções de ordenação
const sortOptions = [
  { value: "name", label: "Nome" },
  { value: "cpf", label: "CPF" },
  { value: "artisan_register_date", label: "Data de Registro" },
  { value: "created_at", label: "Data de Criação" },
  { value: "birthdate", label: "Data de Nascimento" }
];

const onSubmit = handleSubmit((values) => {
  // Remove campos vazios antes de enviar
  const cleanFilters = Object.fromEntries(
    Object.entries(values).filter(
      ([_, value]) => value !== "" && value !== undefined && value !== null
    )
  );
  emit("apply-filters", cleanFilters);
});

const clearFilters = () => {
  resetForm();
  emit("clear-filters");
};

// Auto-ajustar estado quando UF for selecionada
watch(uf, (newUf) => {
  if (newUf) {
    const estadoEncontrado = estados.find((e) => e.uf === newUf);
    if (estadoEncontrado) {
      estado.value = estadoEncontrado.nome;
    }
  } else {
    estado.value = "";
  }
});
</script>

<template>
  <Card class="mb-6">
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg font-semibold"> Filtros de Busca </CardTitle>
        <Button variant="ghost" size="sm" @click="isExpanded = !isExpanded">
          <ChevronDown v-if="!isExpanded" class="h-4 w-4" />
          <ChevronUp v-else class="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent v-show="isExpanded">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Filtros básicos -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <Label for="name">Nome</Label>
            <Input id="name" v-model="name" placeholder="Nome do artesão" />
          </div>

          <div class="space-y-2">
            <Label for="cpf">CPF</Label>
            <Input id="cpf" v-model="cpf" placeholder="000.000.000-00" />
          </div>

          <div class="space-y-2">
            <Label for="municipal_seal">Selo Municipal</Label>
            <Input
              id="municipal_seal"
              v-model="municipal_seal"
              placeholder="Código do selo"
            />
          </div>
        </div>

        <!-- Filtros por data de nascimento -->
        <div class="space-y-2">
          <Label>Data de Nascimento</Label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <Label for="birthdateFrom" class="text-sm text-muted-foreground"
                >De</Label
              >
              <Input id="birthdateFrom" v-model="birthdateFrom" type="date" />
            </div>
            <div class="space-y-1">
              <Label for="birthdateTo" class="text-sm text-muted-foreground"
                >Até</Label
              >
              <Input id="birthdateTo" v-model="birthdateTo" type="date" />
            </div>
          </div>
        </div>

        <!-- Filtros por data de registro -->
        <div class="space-y-2">
          <Label>Data de Registro do Artesão</Label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <Label
                for="artisanRegisterDateFrom"
                class="text-sm text-muted-foreground"
                >De</Label
              >
              <Input
                id="artisanRegisterDateFrom"
                v-model="artisanRegisterDateFrom"
                type="date"
              />
            </div>
            <div class="space-y-1">
              <Label
                for="artisanRegisterDateTo"
                class="text-sm text-muted-foreground"
                >Até</Label
              >
              <Input
                id="artisanRegisterDateTo"
                v-model="artisanRegisterDateTo"
                type="date"
              />
            </div>
          </div>
        </div>

        <!-- Localização e outros -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="space-y-2">
            <Label for="sex">Sexo</Label>
            <select
              id="sex"
              v-model="sex"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="uf">UF</Label>
            <select
              id="uf"
              v-model="uf"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Todos</option>
              <option
                v-for="estado in estados"
                :key="estado.uf"
                :value="estado.uf"
              >
                {{ estado.uf }} - {{ estado.nome }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="sortBy">Ordenar por</Label>
            <select
              id="sortBy"
              v-model="sortBy"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option
                v-for="option in sortOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <Label for="sortOrder">Ordem</Label>
            <select
              id="sortOrder"
              v-model="sortOrder"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>

        <!-- Observações -->
        <div class="space-y-2">
          <Label for="obs">Observações</Label>
          <Input id="obs" v-model="obs" placeholder="Buscar nas observações" />
        </div>

        <!-- Botões -->
        <div class="flex gap-2 pt-4">
          <Button
            type="submit"
            :disabled="loading"
            class="flex items-center gap-2"
          >
            <Search class="h-4 w-4" />
            Aplicar Filtros
          </Button>

          <Button
            type="button"
            variant="outline"
            @click="clearFilters"
            :disabled="loading"
            class="flex items-center gap-2"
          >
            <X class="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

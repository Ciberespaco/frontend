<template>
  <AutoForm
    :schema="artisanSchema"
    :field-config="fieldConfig"
    @submit="onSubmit"
    class="space-y-4"
  >
    <Button type="submit"> Salvar Artesão </Button>
  </AutoForm>
</template>

<script setup lang="ts">
import { AutoForm } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import {
  artisanSchema,
  type ArtisanSchema
} from "@/lib/schemas/artisan.schema";
import { type FieldConfig } from "@/components/ui/auto-form";
import { useArtisans, type Artisan } from "@/composables/useArtisans";
import Swal from "sweetalert2";
import CpfInput from "../basic/CpfInput.vue";

const emit = defineEmits(["submit-success"]);
const props = defineProps<{
  initialData?: Artisan;
}>();

const { createArtisan, error } = useArtisans();
async function onSubmit(values: ArtisanSchema) {
  try {
    await createArtisan(values);
    console.log("Dados do formulário:", values);
    await Swal.fire("Criado!", "O artesão foi criado com sucesso.", "success");
  } catch (err: unknown) {
    Swal.fire({
      icon: "error",
      title: "Erro ao criar",
      text: error.value || "Ocorreu um erro inesperado."
    });
  }
  emit("submit-success", values);
}

const fieldConfig = {
  sex: {
    component: "radio",
    label: "Sexo",
    items: [
      { value: "M", label: "Masculino" },
      { value: "F", label: "Feminino" }
    ]
  },
  obs: {
    component: "textarea",
    label: "Observações",
    componentProps: {
      placeholder: "Detalhes adicionais sobre o artesão..."
    }
  },
  name: { label: "Nome Completo" },
  cpf: {
    label: "CPF",
    component: CpfInput
  },
  municipal_seal: { label: "Selo Municipal" },
  birthdate: { label: "Data de Nascimento" },
  cep: { label: "CEP" },
  house_number: { label: "Número" },
  bairro: { label: "Bairro" },
  localidade: { label: "Localidade (Cidade)" },
  uf: { label: "UF" },
  estado: { label: "Estado" },
  artisan_register_date: { label: "Data de Registro do Artesão" },
  exit_date: { label: "Data de Saída (Opcional)" }
} satisfies FieldConfig<typeof artisanSchema>;
</script>

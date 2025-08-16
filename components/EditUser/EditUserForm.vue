<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import swal from "sweetalert2";
import { Switch } from "@/components/ui/switch";
import { useUpdateUser } from "@/composables/useUpdateUser";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button/Button.vue";
import Separator from "@/components/ui/separator/Separator.vue";

const props = defineProps<{
  user: { id: string | number; name: string; email: string };
}>();
const emit = defineEmits<{
  updated: [{ name: string; email: string }];
  cancel: [];
}>();
const { updateUser, apiError } = useUpdateUser();

const schema = toTypedSchema(
  z
    .object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      email: z.string().email("Email inválido"),
      password: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
          (s) =>
            !s ||
            /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,20}$/.test(
              s
            ),
          {
            message:
              "Senha fraca: 6–20 caracteres com maiúscula, minúscula e número ou símbolo"
          }
        ),
      passwordConfirmation: z.string().optional().or(z.literal(""))
    })
    .refine((d) => d.password === d.passwordConfirmation, {
      path: ["passwordConfirmation"],
      message: "As senhas não coincidem"
    })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    name: props.user.name,
    email: props.user.email,
    password: "",
    passwordConfirmation: ""
  }
});

const { value: name, errorMessage: nameError } = useField<string>("name");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } =
  useField<string>("passwordConfirmation");

watch(
  () => props.user,
  (u) =>
    resetForm({
      values: {
        name: u.name,
        email: u.email,
        password: "",
        passwordConfirmation: ""
      }
    })
);

const loading = computed(() => pending.value);
const pending = ref(false);
const shouldChangePassword = ref(false);

const onSubmit = handleSubmit(async (values) => {
  pending.value = true;
  try {
    let password = "";
    if (values.password) password = values.password;

    await updateUser({ name: values.name, email: values.email, password });

    swal.fire("Sucesso", "Dados atualizados com sucesso!", "success");
    emit("updated", { name: values.name, email: values.email });
  } catch (err: any) {
    swal.fire("Erro", err?.message ?? "Erro ao atualizar usuário", "error");
  } finally {
    pending.value = false;
  }
});
</script>

<template>
  <form class="p-6 bg-white rounded-lg shadow-md" @submit.prevent="onSubmit">
    <h2 class="text-xl font-semibold mb-4">Editar Perfil</h2>

    <!-- nome -->
    <FormField name="name">
      <FormItem class="mb-4">
        <FormLabel>Nome Completo</FormLabel>
        <FormControl>
          <Input v-model="name" type="text" placeholder="Seu nome" />
        </FormControl>
        <FormMessage>{{ nameError }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- email -->
    <FormField name="email">
      <FormItem class="mb-4">
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input v-model="email" type="email" placeholder="seu@email.com" />
        </FormControl>
        <FormMessage>{{ emailError }}</FormMessage>
      </FormItem>
    </FormField>

    <div class="mb-4 flex flex-col gap-4">
      <span class="flex items-center gap-2">
        <Switch v-model="shouldChangePassword" />
        <label for="shouldChangePassword">Alterar Senha?</label>
      </span>
      <Separator />
    </div>

    <!-- nova senha -->
    <FormField v-if="shouldChangePassword" name="password">
      <FormItem class="mb-4">
        <FormLabel>Nova Senha</FormLabel>
        <FormControl>
          <Input
            v-model="password"
            type="password"
            placeholder="Deixe em branco para não alterar"
          />
        </FormControl>
        <FormMessage>{{ passwordError }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- confirmação -->
    <FormField v-if="shouldChangePassword" name="passwordConfirmation">
      <FormItem class="mb-6">
        <FormLabel>Confirme a Nova Senha</FormLabel>
        <FormControl>
          <Input
            v-model="passwordConfirmation"
            type="password"
            placeholder="Repita a nova senha"
          />
        </FormControl>
        <FormMessage>{{ passwordConfirmationError }}</FormMessage>
      </FormItem>
    </FormField>

    <!-- botões -->
    <div class="flex gap-2">
      <Button type="submit" variant="default" :disabled="loading">
        Salvar
      </Button>
      <Button type="button" variant="secondary" @click="emit('cancel')">
        Cancelar
      </Button>
    </div>
  </form>
</template>

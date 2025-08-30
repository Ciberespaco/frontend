<template>
  <EditUser />
</template>

<script setup lang="ts">
import EditUser from "~/components/EditUser/EditUser.vue";
const { setHeader } = useHeader();

setHeader(
  "Usuário",
  "Esta é a página de perfil do usuário. Aqui você pode ver e editar suas informações pessoais."
);

definePageMeta({ layout: "logged" });
</script>

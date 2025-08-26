<template>
  <div class="flex flex-col h-screen px-8 py-16">
    <Title>Usuário</Title>
    <p class="text-lg text-zinc-600">
      Esta é a página de perfil do usuário. Aqui você pode ver e editar suas
      informações pessoais.
    </p>
    <div
      v-if="!isEditing"
      class="flex flex-col mt-8 p-6 bg-white rounded-lg shadow-md"
    >
      <span class="text-sm text-zinc-500 mt-2">
        <b>ID:</b> {{ user?.id || "ID não disponível" }}
      </span>
      <span class="text-sm text-zinc-500 mt-2">
        <b>Nome:</b> {{ user?.name || "Nome não disponível" }}
      </span>
      <span class="text-sm text-zinc-500 mt-2">
        <b>Email:</b> {{ user?.email || "Email não disponível" }}
      </span>
      <div class="mt-4 flex gap-2 text-white">
        <Button
          variant="secondary"
          @click="isEditing = true"
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          @click="handleDelete"
        >
          Excluir
        </Button>
        <Button
          variant="default"
          @click="handleLogout"
        >
          Sair
        </Button>
      </div>
    </div>
    <EditUserForm
      v-if="isEditing && user"
      :user="user"
      @cancel="isEditing = false"
    />
    <div
      v-if="isEditing && user?.id"
      class="mt-6"
    >
      <ChangePassword :user-id="user.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import swal from 'sweetalert2'
import Title from '~/components/basic/Title.vue'
import Button from '~/components/ui/button/Button.vue'
import EditUserForm from '~/components/EditUser/EditUserForm.vue'
import ChangePassword from '~/components/EditUser/ChangePassword.vue'

import { useAuth } from '@/composables/useAuth'
import { useDeleteUser } from '#imports'

const { user, logout } = useAuth()
const isEditing = ref(false)
const { deleteUser } = useDeleteUser()

const handleLogout = () => {
  logout()
  useRouter().push('/login')
}

const handleDelete = () => {
  swal
    .fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar',
    })
    .then((result) => {
      if (result.isConfirmed) {
        deleteUser()
      }
    })
}
</script>

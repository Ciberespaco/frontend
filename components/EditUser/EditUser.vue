<template>
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
    @updated="isEditing = false"
  />
  <div
    v-if="isEditing && user?.id"
    class="mt-6"
  >
    <ChangePassword :user-id="user.id" />
  </div>
</template>

<script setup lang="ts">
import swal from 'sweetalert2'
import Button from '~/components/ui/button/Button.vue'
import EditUserForm from '~/components/EditUser/EditUserForm.vue'
import ChangePassword from '~/components/EditUser/ChangePassword.vue'

import { useAuth } from '@/composables/useAuth'
import { useDeleteUser } from '#imports'

const { user, logout } = useAuth()
const isEditing = ref(false)
const { deleteUser, apiError } = useDeleteUser()

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
    .then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser()
        if (!apiError.value) {
          swal.fire('Deletado!', 'Sua conta foi excluída.', 'success')
          useRouter().push('/login')
        } else {
          swal.fire('Erro!', apiError.value, 'error')
        }
      }
    })
}
</script>

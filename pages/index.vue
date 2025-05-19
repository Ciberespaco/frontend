<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { token, isLoggedIn, user, logout } = useAuth()
const handleLogout = () => {
    logout()
    useRouter().push('/login')
}
</script>

<template>
    <div class="p-8 space-y-4">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Home Page</h1>
            <button @click="handleLogout" class="text-sm text-red-600 underline hover:text-red-800 transition">
                Sair
            </button>
        </div>

        <p>
            <strong>Status:</strong>
            <span :class="isLoggedIn ? 'text-green-600' : 'text-red-600'">
                {{ isLoggedIn ? 'Logado' : 'Não logado' }}
            </span>
        </p>

        <p><strong>Token:</strong> {{ token }}</p>

        <p v-if="user">
            <strong>Usuário:</strong> {{ user.name }} ({{ user.email }})
        </p>
    </div>
</template>
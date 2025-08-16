import { formatError } from "~/lib/utils";

export function useDeleteUser(){
    const authStore = useAuthStore();
    const apiError = ref<string | null>(null);
    const loading = ref(false);
    
    const deleteUser = async () => {
        apiError.value = null;
        loading.value = true;
    
       try {
        await useFetch(`/user/${authStore.user?.id}`, {
          method: "DELETE"
        });
        authStore.clearAuth();
       } catch (err: unknown) {
        apiError.value = formatError(err);
       } finally {
        loading.value = false;
       }
    }

    return {
        deleteUser,
        loading,
        apiError
    };
}


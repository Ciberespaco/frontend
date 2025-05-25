import axios from "axios";
import { formatError } from "~/lib/utils";

export function useRegister() {
  const apiError = ref<string | null>(null);
  const loading = ref(false);

  const register = async (email: string, password: string, name: string) => {
    apiError.value = null;

    try {
      loading.value = true;
      await axios.post("/user", {
        email,
        password,
        name
      });
    } catch (err: unknown) {
      loading.value = false;
      apiError.value = formatError(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    register,
    apiError,
    loading
  };
}

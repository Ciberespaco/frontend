import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("auth_token", token);
    },

    setUser(user: User) {
      this.user = user;
    },

    clearAuth() {
      this.user = null;
      this.token = null;
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("auth_token");
    },

    async initialize() {
      if (import.meta.client) {
        const token = localStorage.getItem("auth_token");

        if (token) {
          this.setToken(token);
          try {
            const { data } = await axios.get("/user/me");
            this.setUser(data);
          } catch {
            this.clearAuth();
          }
        }
      }
    }
  }
});

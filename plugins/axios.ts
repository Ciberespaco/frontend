import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  axios.defaults.baseURL = config.public.backendURL;
  axios.defaults.headers.common["Content-Type"] = "application/json";
});

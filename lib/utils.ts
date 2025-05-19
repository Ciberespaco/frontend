import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatError(err: unknown): string {
  const axiosErr = err as AxiosError<any>;
  const resData = axiosErr?.response?.data;

  if (resData) {
    if (resData.message) {
      return Array.isArray(resData.message)
        ? resData.message.join(", ")
        : String(resData.message);
    }
    if (resData.detail) return String(resData.detail);
    if (resData.error) return String(resData.error);
  }

  if (typeof err === "string") return err;

  if (err instanceof Error) return err.message;

  return "Ocorreu um erro inesperado.";
}

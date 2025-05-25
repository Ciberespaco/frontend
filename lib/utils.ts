import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { isAxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ErrorResponse {
  message?: string | string[];
  detail?: string;
  error?: string;
}

export function formatError(err: unknown): string {
  if (isAxiosError(err)) {
    const resData = err.response?.data as ErrorResponse | undefined;

    if (resData) {
      if (resData.message) {
        return Array.isArray(resData.message)
          ? resData.message.join(", ")
          : String(resData.message);
      }
      if (resData.detail) {
        return String(resData.detail);
      }
      if (resData.error) {
        return String(resData.error);
      }
    }

    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Ocorreu um erro inesperado.";
}

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

/**
 * Formats a CPF string with proper punctuation (e.g., 123.456.789-00)
 * @param cpf The raw CPF string
 * @returns Formatted CPF string or dash if null/invalid
 */
export const formatCpf = (cpf: string | null): string => {
  if (!cpf) return "-";
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

/**
 * Formats a date string to Brazilian date format (DD/MM/YYYY)
 * @param dateString The date string to format
 * @returns Formatted date or dash if null/invalid
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
};

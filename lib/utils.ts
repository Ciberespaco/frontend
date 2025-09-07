import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { isAxiosError } from 'axios'
import { CalendarDate } from '@internationalized/date'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ErrorResponse {
  message?: string | string[]
  detail?: string
  error?: string
}

export function formatError(err: unknown): string {
  if (isAxiosError(err)) {
    const resData = err.response?.data as ErrorResponse | undefined

    if (resData) {
      if (resData.message) {
        return Array.isArray(resData.message)
          ? resData.message.join(', ')
          : String(resData.message)
      }
      if (resData.detail) {
        return String(resData.detail)
      }
      if (resData.error) {
        return String(resData.error)
      }
    }

    return err.message
  }

  if (typeof err === 'string') {
    return err
  }

  if (err instanceof Error) {
    return err.message
  }

  return 'Ocorreu um erro inesperado.'
}

/**
 * Formats a CPF string with proper punctuation (e.g., 123.456.789-00)
 * @param cpf The raw CPF string
 * @returns Formatted CPF string or dash if null/invalid
 */
export const formatCpf = (cpf: string | null): string => {
  if (!cpf) return '-'
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formats a date string to Brazilian date format (DD/MM/YYYY)
 * @param dateString The date string to format
 * @returns Formatted date or dash if null/invalid
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }
  catch {
    return '-'
  }
}

export const formatDateTime = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleString('pt-BR')
}

export const formatCEP = (cep: string) => {
  if (!cep) return ''
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2')
}

export const isValidCpf = (cpf: string): boolean => {
  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false
  }

  let sum = 0
  let remainder

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false
  }

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false
  }

  return true
}

export function toCalendarDate(
  date: string | Date | null | undefined,
): CalendarDate | null {
  if (!date) return null
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  return new CalendarDate(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
 
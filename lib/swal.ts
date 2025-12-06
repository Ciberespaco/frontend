import Swal from 'sweetalert2'

// Base configuration for all alerts
const baseConfig = {
  heightAuto: false,
  zIndex: 100000, // Extremely high z-index to ensure it's above all modals
  target: 'body', // Explicitly target body
}

// Inject global style to force z-index if inline styles are overridden
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    .swal2-container {
      z-index: 100000 !important;
    }
  `
  document.head.appendChild(style)
}

export const showSuccessToast = (title: string) => {
  Swal.fire({
    ...baseConfig,
    title,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      container: '!pointer-events-none',
      popup: '!pointer-events-auto',
    },
  })
}

export const showErrorAlert = (text: string, title = 'Ocorreu um Erro!') => {
  Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#d33',
  })
}

export const showWarningAlert = (text: string, title = 'Atenção') => {
  Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#f59e0b',
  })
}

export const showConfirmDialog = async (options: {
  title: string
  text: string
  confirmButtonText?: string
  confirmButtonColor?: string
}): Promise<boolean> => {
  const { title, text, confirmButtonText = 'Sim, excluir!', confirmButtonColor = '#d33' } = options

  const result = await Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
  })

  return result.isConfirmed
}

export const ShowCrudErrorAlert = (entityName: string, action: string, errorMessage: string) => {
  Swal.fire({
    ...baseConfig,
    title: `Erro ao ${action} ${entityName}`,
    text: errorMessage,
    icon: 'error',
    confirmButtonColor: '#d33',
  })
}

export const showLoadingAlert = (title = 'Carregando...') => {
  Swal.fire({
    ...baseConfig,
    title: title,
    text: 'Por favor, aguarde um momento.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

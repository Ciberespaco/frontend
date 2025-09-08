import Swal from 'sweetalert2'

export const showSuccessToast = (title: string) => {
  Swal.fire({
    title,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  })
}

export const showErrorAlert = (text: string, title = 'Ocorreu um Erro!') => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#d33',
  })
}

export const showConfirmDialog = async (options: {
  title: string
  text: string
  confirmButtonText?: string
}): Promise<boolean> => {
  const { title, text, confirmButtonText = 'Sim, excluir!' } = options

  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText,
    cancelButtonText: 'Cancelar',
  })

  return result.isConfirmed
}

export const ShowCrudErrorAlert = (entityName: string, action: string, errorMessage: string) => {
  Swal.fire({
    title: `Erro ao ${action} ${entityName}`,
    text: errorMessage,
    icon: 'error',
    confirmButtonColor: '#d33',
  })
}

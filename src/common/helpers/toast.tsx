import { globalStore, type IToast } from '../config/globalStore'
import { v4 } from 'uuid'

class Toast {
  private addToast(message: string, type: 'success' | 'error') {
    const id = v4()

    const newToast: IToast = { id, message, type }

    const toasts = globalStore?.getState()?.toasts.value || []

    globalStore?.setFieldValue('toasts', [...toasts, newToast])
  }

  show = {
    success: (message: string) => {
      this.addToast(message, 'success')
    },
    error: (message: string) => {
      this.addToast(message, 'error')
    },
  }

  remove = (id: string) => {
    const toasts = globalStore?.getState()?.toasts.value || []

    globalStore?.setFieldValue(
      'toasts',
      toasts.filter((toast: IToast) => toast.id !== id),
    )
  }
}

export default new Toast()

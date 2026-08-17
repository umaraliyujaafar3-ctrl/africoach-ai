import { create } from 'zustand'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastState {
  toasts: Toast[]
  add: (message: string, type?: ToastType) => void
  remove: (id: number) => void
}

let toastCounter = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  add: (message, type = 'success') => {
    const id = ++toastCounter
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    window.setTimeout(() => get().remove(id), 3600)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toastIcons: Record<ToastType, LucideIcon> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

export function toast(message: string, type: ToastType = 'success') {
  useToastStore.getState().add(message, type)
}

export default useToastStore

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  signup: (user: User) => void
  login: (email: string) => void
  logout: () => void
  updateProfile: (patch: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signup: (user) => set({ user, isAuthenticated: true }),
      login: (email) =>
        set({ user: { name: 'Guest User', email }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (patch) =>
        set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
    }),
    { name: 'africoach-auth' },
  ),
)

export default useAuthStore

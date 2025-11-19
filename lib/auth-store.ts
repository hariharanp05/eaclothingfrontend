import { create } from "zustand"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: Date
}

interface AuthStore {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({
      user: {
        id: "1",
        email,
        name: email.split("@")[0],
        createdAt: new Date(),
      },
      isLoggedIn: true,
    })
  },
  signup: async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    set({
      user: {
        id: String(Date.now()),
        email,
        name,
        createdAt: new Date(),
      },
      isLoggedIn: true,
    })
  },
  logout: () => set({ user: null, isLoggedIn: false }),
  updateProfile: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}))

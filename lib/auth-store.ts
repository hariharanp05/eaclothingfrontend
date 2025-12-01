"use client";

import { create } from "zustand";


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

const ADMIN_EMAIL = "admin@eacloth.com";   // 🔹 CHANGE THIS
const ADMIN_PASSWORD = "admineacloth";             // 🔹 CHANGE THIS

type AdminAuthState = {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  // ✅ same for server + client on first render
  isAdmin: false,

  login: async (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("isAdmin", "true");
      }
      set({ isAdmin: true });
    } else {
      throw new Error("Invalid email or password");
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isAdmin");
    }
    set({ isAdmin: false });
  },
}));
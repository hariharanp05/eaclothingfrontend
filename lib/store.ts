import { create } from "zustand"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  sizes: string[]
  colors: string[]
  description: string
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => {
      const existingItem = state.items.find(
        (item) => item.product.id === newItem.product.id && item.size === newItem.size && item.color === newItem.color,
      )
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item === existingItem ? { ...item, quantity: item.quantity + newItem.quantity } : item,
          ),
        }
      }
      return { items: [...state.items, newItem] }
    }),
  removeItem: (productId, size, color) =>
    set((state) => ({
      items: state.items.filter(
        (item) => !(item.product.id === productId && item.size === size && item.color === color),
      ),
    })),
  updateQuantity: (productId, size, color, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId && item.size === size && item.color === color ? { ...item, quantity } : item,
      ),
    })),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  },
  getTotalItems: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.quantity, 0)
  },
}))

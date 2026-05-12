import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  sku?: string
  image?: string
}

interface CartState {
  items: CartItem[]
  operationId: string
  
  // Actions
  addItem: (product: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  resetOperationId: () => void
  
  // Getters
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      operationId: uuidv4(),

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.productId === product.productId)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter(item => item.quantity > 0),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      resetOperationId: () => {
        set({ operationId: uuidv4() })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.quantity * item.price, 0)
      },
    }),
    {
      name: 'synoids-cart-storage',
    }
  )
)

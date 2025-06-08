// stores/cartStore.js
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [], // Array of { productId, quantity, price, name, image }

      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === product.id
          )
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          } else {
            return {
              cartItems: [...state.cartItems, { ...product, quantity }]
            }
          }
        }),

      incrementQuantity: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })),

      decrementQuantity: (productId) =>
        set((state) => ({
          cartItems: state.cartItems
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0) // Remove if quantity drops to 0
        })),

      removeItem: (productId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== productId)
        })),

      clearCart: () => set({ cartItems: [] })
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
)

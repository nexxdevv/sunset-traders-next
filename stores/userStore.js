// stores/userStore.js
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      user: null, // Firebase user object
      isAuthenticated: false, // Initial state
      savedProducts: [],

      setUser: (userData) =>
        set({ user: userData, isAuthenticated: !!userData }),
      addSavedProduct: (product) =>
        set((state) => ({
          savedProducts: [...state.savedProducts, product]
        })),
      removeSavedProduct: (productId) =>
        set((state) => ({
          savedProducts: state.savedProducts.filter(
            (product) => product.id !== productId
          )
        })),
      clearSavedProducts: () => set({ savedProducts: [] }),
      logout: () =>
        set({ user: null, isAuthenticated: false, savedProducts: [] })
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        savedProducts: state.savedProducts,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

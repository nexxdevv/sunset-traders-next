// stores/userStore.js
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useUserStore = create(
  persist(
    (set) => ({
      user: null, // Firebase user object
      isAuthenticated: false, // Initial state
      favorites: [], // Array of favorite product IDs

      // This action correctly updates isAuthenticated based on userData presence
      setUser: (userData) =>
        set({ user: userData, isAuthenticated: !!userData }),
      addFavorite: (productId) =>
        set((state) => ({ favorites: [...state.favorites, productId] })),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId)
        })),
      clearFavorites: () => set({ favorites: [] }),
      logout: () => set({ user: null, isAuthenticated: false, favorites: [] })
    }),
    {
      name: "user-storage", // unique name
      storage: createJSONStorage(() => localStorage),
      // Include isAuthenticated in partialize so it's saved/loaded
      partialize: (state) => ({
        favorites: state.favorites,
        isAuthenticated: state.isAuthenticated // <--- ADD THIS LINE
      })
    }
  )
)
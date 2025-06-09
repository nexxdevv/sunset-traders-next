"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"
import { Product } from "@/types/product"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: string
    image: string
    description: string
  }
  direction?: "row" | "col" // default to "row"
}

export function ProductActions({
  product,
  direction = "row"
}: ProductActionsProps) {
  const { favorites, addFavorite, removeFavorite } = useUserStore()
  const { cartItems, addToCart, removeItem } = useCartStore()

  const isFavorited = favorites.includes(product.id)
  interface CartItem {
    id: string
    name: string
    price: string
    image: string
    description: string
  }

  const isInCart: boolean = cartItems.some(
    (item: CartItem) => item.id === product.id
  )

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorited) {
      removeFavorite(product.id)
    } else {
      addFavorite(product.id)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInCart) {
      removeItem(product.id)
    } else {
      addToCart(product)
    }
  }

  return (
    <div
      className={`flex ${direction === "col" ? "flex-col" : "flex-row"} gap-3`}
    >
      <button
        onClick={handleFavoriteToggle}
        className={`p-3 rounded-full shadow-md ${
          isFavorited ? "bg-red-500 text-white" : "bg-white text-gray-700"
        }`}
      >
        <Heart
          className="w-5 h-5"
          fill={isFavorited ? "currentColor" : "none"}
        />
      </button>
      <button
        onClick={handleAddToCart}
        className={`p-3 rounded-full shadow bg-white text-gray-700 relative ${
          isInCart ? "bg-yellow-400" : "hover:bg-gray-100"}`}
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </div>
  )
}

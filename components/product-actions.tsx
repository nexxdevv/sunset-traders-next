"use client"

import { Heart, ShoppingCart } from "lucide-react"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"

interface ProductActionsProps {
  product: {
    id: string
    name: string
    price: string
    imageUrl: string
    description: string
  }
  direction?: "row" | "col" // default to "row"
  size?: "sm" | "md" // optional size prop for button scaling
}

export function ProductActions({
  product,
  direction = "row",
  size = "md" // default size is "md"
}: ProductActionsProps) {
  const { favorites, addFavorite, removeFavorite } = useUserStore()
  const { cartItems, addToCart, removeItem } = useCartStore()

  const isFavorited = favorites.includes(product.id)
  interface CartItem {
    id: string
    name: string
    price: string
    imageUrl: string
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
          size === "sm" && "scale-[83%]"
        } ${isFavorited ? "bg-red-500 text-white" : "bg-white text-gray-700"}`}
      >
        <Heart
          className="w-5 h-5"
        />
      </button>
      <button
        onClick={handleAddToCart}
        className={`p-3 rounded-full shadow  text-gray-700 relative ${
          size === "sm" && "scale-[83%]"
        } ${isInCart ? "bg-[#365DB6] text-white" : "hover:bg-gray-100 bg-white"}`}
      >
        <ShoppingCart className="w-5 h-5" />
      </button>
    </div>
  )
}

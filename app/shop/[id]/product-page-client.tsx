"use client"

import { useCartStore } from "@/stores/cartStore"
import { useUserStore } from "@/stores/userStore"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function ProductPageClient({ product }: { product: Product }) {
  const { favorites, addFavorite, removeFavorite, isAuthenticated } =
    useUserStore()
  const { cartItems, addToCart } = useCartStore()

  const isFavorited = favorites.includes(product.id)
  interface CartItem {
    id: string
    name: string
    description: string
    price: number
    image: string
    // Add other properties if needed
  }

  const isInCart: boolean = (cartItems as CartItem[]).some(
    (item: CartItem) => item.id === product.id
  )

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      alert("Please log in to favorite items!")
      return
    }

    if (isFavorited) {
      removeFavorite(product.id)
    } else {
      addFavorite(product.id)
    }
  }

  const handleAddToCart = () => {
    if (isInCart) {
      alert("Already in cart!")
      return
    }
    addToCart(product)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-blue-500 mb-4 inline-block">
          ← Back to Shop
        </Link>

        <div className="relative w-full h-[400px] sm:h-[500px] mb-6">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded-xl shadow"
            priority
          />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <span className="text-xl font-semibold">${product.price}</span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {product.description}
        </p>

        <div className="flex gap-4">
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-full shadow-md ${
              isFavorited(product.id)
                ? "bg-red-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorited(product.id) ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}

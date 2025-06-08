"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingCart } from "lucide-react"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"

interface Product {
  id: string
  name: string
  price: string
  image: string
  description: string
}

interface ProductFullScreenViewProps {
  products: Product[]
  onClose: () => void
}

export default function ProductFullScreenView({
  products
}: ProductFullScreenViewProps) {
  const { favorites, addFavorite, removeFavorite, isAuthenticated } =
    useUserStore()
  const { cartItems, addToCart } = useCartStore()

  const isFavorited = (id: string) => favorites.includes(id)
  const isInCart = (id: string) =>
    cartItems.some((item: { id: string }) => item.id === id)

  const handleFavoriteToggle = (productId: string) => {
    if (!isAuthenticated) {
      alert("Please log in to favorite items!")
      return
    }
    if (isFavorited(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  const handleAddToCart = (product: Product) => {
    if (isInCart(product.id)) {
      alert("Already in cart!")
      return
    }
    addToCart(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto snap-y snap-mandatory h-screen"
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="h-screen flex flex-col items-center justify-center snap-start p-4 md:p-8 relative"
        >
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="w-full max-w-md h-auto object-contain rounded-lg shadow-xl"
            priority
          />

          {/* Floating Buttons */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 space-y-4 flex flex-col">
            <button
              onClick={() => handleFavoriteToggle(product.id)}
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
              onClick={() => handleAddToCart(product)}
              className="p-3 rounded-full shadow-md bg-white text-gray-700 relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {isInCart(product.id) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          </div>

          <div className="mt-4 ">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {product.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">${product.price}</p>
            <p className="text-gray-600 max-w-[90%] dark:text-gray-400 mt-2">
              {product.description}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

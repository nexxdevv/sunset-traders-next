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
  products,
  onClose
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
    isFavorited(productId) ? removeFavorite(productId) : addFavorite(productId)
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
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto snap-y snap-mandatory"
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="relative w-full h-screen snap-start bg-black overflow-hidden"
        >
          {/* Fullscreen Image */}
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover w-full h-full"
            priority
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Product Details Fixed to Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="font-semibold text-[1.1rem] leading-tight">
              {product.name}
            </h2>
            <p className="font-semibold leading-tight">${product.price}</p>
            <p className=" mt-1">{product.description}</p>
          </div>

          {/* Floating Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col items-center justify-center space-y-4 z-10">
            <button
              onClick={() => handleFavoriteToggle(product.id)}
              className={`p-3 rounded-full shadow-lg transition-colors ${
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
              className="p-3 rounded-full bg-white text-gray-700 relative shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              {isInCart(product.id) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  )
}

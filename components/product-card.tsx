"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: string
    image: string
    description: string
  }
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { favorites, addFavorite, removeFavorite, isAuthenticated } =
    useUserStore()
  const { cartItems, addToCart } = useCartStore()

  const isFavorited = favorites.includes(product.id)
  interface CartItem {
    id: string
    name: string
    price: string
    image: string
    description: string
  }

  const isInCart = cartItems.some((item: CartItem) => item.id === product.id)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      alert("Please log in to favorite items!")
      return
    }
    isFavorited ? removeFavorite(product.id) : addFavorite(product.id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCart) {
      alert("Already in cart!")
      return
    }
    addToCart(product)
  }

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        layoutId={`product-card-${product.id}`}
        className="relative flex flex-col items-center justify-center
                   bg-white dark:bg-gray-800 rounded-lg overflow-hidden
                   shadow-lg hover:shadow-xl cursor-pointer aspect-square"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.1 }}
        tabIndex={0}
        role="link"
      >
        <div className="absolute top-2 left-2 right-2 z-10 flex justify-center gap-3 px-2">
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full shadow ${
              isFavorited ? "bg-white" : "bg-white text-gray-700"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${isFavorited ? "text-red-500" : ""}`}
              fill={isFavorited ? "red" : "none"}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full shadow bg-white text-gray-700 relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {isInCart && (
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full" />
            )}
          </button>
        </div>

        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-auto object-cover"
          priority={index < 4}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent text-white">
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="font-medium">${product.price}</p>
        </div>
      </motion.div>
    </Link>
  )
}

"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"

export const CartIcon = () => {
  const { cartItems } = useCartStore()

  if (cartItems.length === 0) return null // ← only show if items exist

  return (
    <Link href="/cart" className="fixed top-[72px] right-3 z-50">
      <div className="relative p-2 bg-yellow-400 shadow rounded-full hover:scale-105 transition">
        <ShoppingCart className="w-6 h-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartItems.length}
        </span>
      </div>
    </Link>
  )
}

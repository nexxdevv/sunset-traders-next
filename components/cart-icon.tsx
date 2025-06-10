"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { usePathname } from "next/navigation"

export const CartIcon = () => {
  const { cartItems } = useCartStore()
  const pathname = usePathname()

  if (pathname === "/cart" || cartItems.length === 0) return null

  return (
    <Link href="/cart" className="fixed top-[72px] right-3 z-[60]">
      <button className="relative p-2 ring-2 ring-offset-black ring-accent  bg-yellow-400 shadow rounded-full hover:scale-105 transition">
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartItems.length}
        </span>
      </button>
    </Link>
  )
}

"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/stores/cartStore"
import { Button } from "@/components/ui/button"
import CheckoutButton from "@/components/checkout-button"

export default function CartPage() {
  interface CartItem {
    id: string
    name: string
    price: number
    imageUrl: string
    quantity: number
  }

  interface CartStore {
    cartItems: CartItem[]
    removeItem: (id: string) => void
  }

  const { cartItems, removeItem }: CartStore = useCartStore()

  const total: number = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0
  )

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your cart is empty.{" "}
          <Link href="/" className="text-blue-500 underline">
            Continue shopping
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="md:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm"
              >
                <Image
                  src={item.imageUrl || "/placeholder.png"}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-20 h-20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    ${item.price}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => removeItem(item.id)}
                  className="text-sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Total:</span>
              <span className="font-bold">${Number(total)}</span>
            </div>
            <CheckoutButton cartItems={cartItems} />
          </div>
        </div>
      )}
    </div>
  )
}

// components/CartDrawer.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button" // Assuming this is your shadcn/ui Button
import CheckoutButton from "@/components/ui/checkout-button" // Your existing CheckoutButton
import { Funnel_Display } from "next/font/google"

const funnel_display = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"]
})

interface CartItem {
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface CartDrawerProps {
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  cartItems: CartItem[]
  removeItem: (id: string) => void
  total: number
}

export default function CartDrawer({
  cartOpen,
  setCartOpen,
  cartItems,
  removeItem,
  total
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            key="cart-underlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[70px] z-30 bg-black/30 backdrop-blur-lg"
            onClick={() => setCartOpen(false)}
          />

          <motion.div
            key="cart-drawer"
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
            className="fixed top-[70px] right-0 h-[calc(100vh-70px)] w-[85%] max-w-md bg-merchant shadow-lg z-40 py-3  overflow-y-auto" // Added overflow-y-auto
          >
            <div>
              <h1
                className={`${funnel_display.className} text-3xl font-bold px-3 mb-6 text-white`}
              >
                Cart
              </h1>

              {cartItems.length === 0 ? (
                <p className="text-center text-gray-200 text-lg">
                  Your cart is empty.{" "}
                  <Link
                    href="/"
                    onClick={() => setCartOpen(false)}
                    className="text-yellow-500 underline"
                  >
                    Continue shopping
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {/* Items Section */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col justify-between w-full gap-2 bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <Image
                            src={item.imageUrl || "/placeholder.png"}
                            alt={item.name}
                            width={70}
                            height={70}
                            className="rounded-lg object-cover w-16 h-16"
                          />
                          <Button
                            variant="destructive" // Use a more appropriate variant for remove
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-xs ring-1 ring-gray-500/30 text-red-400"
                          >
                            Remove
                          </Button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white leading-tight text-base">
                            {item.name}
                          </h3>
                          <p className="dark:text-gray-300 text-base font-semibold">
                            ${item.price} x {item.quantity}
                          </p>
                        </div>
                        <p className="text-right text-gray-700 dark:text-gray-400 text-sm">
                          Subtotal: ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Summary Section */}
                  <div className="bg-gray-100 dark:bg-gray-700 p-6 shadow-md mt-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                      Order Summary
                    </h2>
                    <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                      <span>Items ({cartItems.length})</span>
                      <span>
                        $
                        {cartItems.reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )}
                      </span>
                    </div>
                    {/* Add more summary lines if needed, e.g., shipping, tax */}
                    <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4 border-gray-300 dark:border-gray-600">
                      <span className="text-gray-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        ${total}
                      </span>
                    </div>
                    <div className="mt-6">
                      <CheckoutButton cartItems={cartItems} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

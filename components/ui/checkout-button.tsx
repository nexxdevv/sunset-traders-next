"use client"

import { auth } from "@/lib/firebase"
import { useState } from "react"
import getStripe from "@/lib/get-stripejs"
import { FaStripe } from "react-icons/fa6"
import { useUserStore } from "@/stores/userStore"

interface CartItem {
  id: string // Or whatever your product ID is
  name: string
  price: number
  imageUrl: string // Must be a public URL
  quantity: number // If you want to support multiple quantities
  // ... any other relevant product fields
}
export default function CheckoutButton({
  cartItems
}: {
  cartItems: CartItem[]
}) {
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const handleCheckout = async () => {
    try {
      const userId = auth.currentUser?.uid
      if (!userId) {
        alert("Please log in to proceed with checkout.")
        return // Exit if no user
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ cartItems, userId: user.uid })
      })
      const data = await res.json()
      console.log("Checkout response:", data)

      if (!res.ok || data.error) {
        console.error("API error:", data.error)
        alert(`Checkout failed: ${data.error || "Please try again."}`)
        return
      }

      const sessionId = data.sessionId
      const stripe = await getStripe()
      const result = await stripe?.redirectToCheckout({ sessionId })

      if (result?.error) {
        console.error("Stripe redirect error:", result.error.message)
        alert(`Stripe error: ${result.error.message}`)
      }
      setIsLoading(true) // Start loading state
    } catch (error) {
      console.error("Checkout process failed:", error)
      alert("An unexpected error occurred during checkout.")
    } finally {
      setIsLoading(false) // Stop loading regardless of outcome
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className=" py-1 w-full bg-yellow-400 text-gray-900 cursor-pointer font-[700] hover:bg-gray-800 hover:text-white transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-[21px] scale-[.85]"
    >
      {isLoading ? (
        "Processing..."
      ) : (
        <>
          Checkout with{" "}
          <FaStripe size={56} className="inline-block translate-y-[1px]" />
        </>
      )}
    </button>
  )
}

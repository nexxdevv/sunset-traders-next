"use client"

import { auth } from "@/lib/firebase"
import { useState } from "react"
import getStripe from "@/lib/get-stripejs"

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
        body: JSON.stringify({ cartItems, userId })
      })
      const data = await res.json()

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
      className="px-4 py-2 w-full bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-gray-800 transition"
    >
      {isLoading ? "Processing..." : "Checkout with Stripe"}
    </button>
  )
}

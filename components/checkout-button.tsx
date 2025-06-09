"use client"

import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function CheckoutButton({ cartItems }: { cartItems: any[] }) {
  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems })
    })

    const data = await res.json()

    if (!data.sessionId) {
      console.error("No sessionId returned from API", data)
      alert("Failed to initiate Stripe Checkout.")
      return
    }

    const stripe = await stripePromise
    const result = await stripe?.redirectToCheckout({
      sessionId: data.sessionId
    })

    if (result?.error) {
      console.error("Stripe redirect error", result.error.message)
      alert("Stripe error: " + result.error.message)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      Checkout
    </button>
  )
}

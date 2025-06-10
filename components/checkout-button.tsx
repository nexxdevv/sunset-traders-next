"use client"

import { loadStripe } from "@stripe/stripe-js"
import { auth } from "@/lib/firebase"
import { useState } from "react"

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

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
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("Please log in to proceed with checkout.");
        return; // Exit if no user
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, userId })
      });

      const data = await res.json();

      if (!res.ok) { // Check res.ok for HTTP errors (e.g., 400, 500)
        console.error("API error:", data.error);
        alert(`Checkout failed: ${data.error || "Please try again."}`);
        return;
      }

      if (!data.sessionId) {
        console.error("No sessionId returned from API", data);
        alert("Failed to initiate Stripe Checkout.");
        return;
      }

      const stripe = await stripePromise;
      const result = await stripe?.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (result?.error) {
        console.error("Stripe redirect error", result.error.message);
        alert("Stripe error: " + result.error.message);
      }
    } catch (error) {
      console.error("Checkout process failed:", error);
      alert("An unexpected error occurred during checkout.");
    } finally {
      setIsLoading(false); // Stop loading regardless of outcome
    }
  }

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
    >
      {isLoading ? "Processing..." : "Checkout"}
    </button>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useCartStore } from "@/stores/cartStore"

type LineItem = {
  description: string
  quantity: number
  amount_total: number
  price?: {
    product?: {
      images?: string[]
      name: string
      subtitle?: string
      price: number
      description: string
    }
  }
}

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orderSavedSuccessfully, setOrderSavedSuccessfully] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("session_id")
    setSessionId(id)
  }, [])

  useEffect(() => {
    if (!sessionId) return

    const fetchAndSaveOrder = async () => {
      try {
        const res = await fetch(`/api/checkout?session_id=${sessionId}`)
        const session = await res.json()

        const order = {
          id: session.id,
          userId: session.metadata.userId,
          total: session.amount_total / 100,
          customer: session.customer_details.name,
          email: session.customer_details.email,
          items: session.line_items.data.map((item: LineItem) => ({
            name: item.price?.product?.name || "Unknown",
            description: item.price?.product?.description,
            quantity: item.quantity,
            price: item.amount_total / 100,
            image:
              item.price?.product?.images?.[0] || "/placeholder-product.jpg"
          })),
          date: new Date().toISOString()
        }

        await addDoc(collection(db, "orders"), order)

        setOrderSavedSuccessfully(true)
        clearCart()
      } catch (error) {
        console.error("Failed to save order:", error)
        setOrderSavedSuccessfully(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAndSaveOrder()
  }, [sessionId, clearCart])

  // Effect for redirection after successful order save
  useEffect(() => {
    if (orderSavedSuccessfully) {
      const timer = setTimeout(() => {
        router.push("/orders")
      }, 3000) // Redirect after 3 seconds

      return () => clearTimeout(timer) // Clear the timeout if the component unmounts
    }
  }, [orderSavedSuccessfully, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {loading ? (
          <>
            <svg
              className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <p className="text-xl font-semibold text-gray-700">
              Processing your order...
            </p>
            <p className="text-gray-500">Please wait a moment.</p>
          </>
        ) : orderSavedSuccessfully ? (
          <>
            <svg
              className="h-16 w-16 text-green-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Thank you for your order!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your purchase was successful and your order has been placed.
            </p>
            <p className="text-md text-gray-500">
              You'll be redirected to your orders in 3 seconds...
            </p>
          </>
        ) : (
          <>
            <svg
              className="h-16 w-16 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h1 className="text-3xl font-bold text-red-700 mb-2">
              Order Failed
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              There was an issue saving your order.
            </p>
            <p className="text-md text-gray-500">
              Please check your account or contact support for assistance.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

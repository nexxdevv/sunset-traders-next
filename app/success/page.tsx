"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"
import { useUserStore } from "@/stores/userStore"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { user } = useUserStore()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orderSavedSuccessfully, setOrderSavedSuccessfully] = useState(false)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      console.error("No sessionId found in URL.")
      return
    }

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
          items: session.line_items.data.map((item: any) => ({
            name: item.description,
            quantity: item.quantity,
            price: item.amount_total / 100,
            image: item.price?.product?.images?.[0] || "/placeholder-product.jpg"
          })),
          date: new Date().toISOString()
        }

        // Save to "orders" collection
        await addDoc(collection(db, "orders"), order)

        setOrderSavedSuccessfully(true)
        router.push("/account")
      } catch (error) {
        console.error("Failed to save order:", error)
        setOrderSavedSuccessfully(false)
      } finally {
        setLoading(false)
      }
    }

    fetchAndSaveOrder()
  }, [sessionId, router])

  return (
    <div className="p-6 text-center">
      {loading
        ? "Processing your order..."
        : orderSavedSuccessfully
        ? "Redirecting to account..."
        : "Failed to save order. Please check your account or contact support."}
    </div>
  )
}

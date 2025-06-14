// app/api/checkout/route.ts
import { NextResponse, NextRequest } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil"
})

interface CartItem {
  id: string
  name: string
  price: number // Use this for unit_amount
  imageUrl: string // Use this for product_data.images
  quantity: number
  description?: string // Optional: Add if you want to send a description
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cartItems, userId } = body as {
      cartItems: CartItem[]
      userId: string
    }

    // Basic validation
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    // Create the Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: cartItems.map((item: CartItem) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            description: item.description,
            images: [item.imageUrl]
          },
          unit_amount: Math.round((item.price ?? 0) * 100) // Convert price to cents
        },
        quantity: item.quantity ?? 1
      })),
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        userId // Pass userId to metadata
      }
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error: unknown) {
    console.error("Stripe session creation error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const session_id = searchParams.get("session_id")

  if (!session_id) {
    return new Response("Session ID is required", { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer_details", "line_items.data.price.product"] // Expand necessary fields
    })

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error fetching Stripe session:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

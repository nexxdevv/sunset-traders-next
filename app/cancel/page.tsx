import Link from "next/link"

export default function CancelPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">❌ Payment Cancelled</h1>
      <p className="mt-4">Your payment was not successful. Please try again.</p>
      <Link href="/cart">
        <button>Back to Cart</button>
      </Link>
    </div>
  )
}

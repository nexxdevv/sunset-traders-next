// app/likes/page.tsx
"use client"

import { useUserStore } from "@/stores/userStore"
import { products } from "@/data/products"
import ProductCard from "@/components/product-card"

export default function LikesPage() {
  const { favorites } = useUserStore()
  const likedProducts = products.filter((p) => favorites.includes(p.id))

  return (
    <div className="max-w-6xl mx-auto h-screen px-6 py-10">
      {likedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t liked any products yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {likedProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

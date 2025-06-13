// app/likes/page.tsx
"use client"

import { useUserStore } from "@/stores/userStore"
import ProductCard from "@/components/product-card/product-card-grid"
import { Product } from "@/types/product"

export default function SavedItemsPage() {
  const { savedProducts } = useUserStore()

  return (
    <div className="max-w-6xl mx-auto h-screen px-6 py-10">
      {savedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t liked any products yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {savedProducts.map((product: Product, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

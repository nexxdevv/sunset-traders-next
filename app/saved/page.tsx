"use client"

import { useUserStore } from "@/stores/userStore"

import { Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"

export default function SavedItemsPage() {
  const { savedProducts } = useUserStore()

  return (
    <div className="max-w-6xl mx-auto h-screen px-6 py-20">
      {savedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t saved any products yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {savedProducts.map((product: Product, index: number) => (
            <div key={index}>
              <Link href={`/shop/${product.id}`}>
                <Image
                  src={product.imageUrl || "/placeholder.png"}
                  width={200}
                  height={200}
                  className="rounded-lg cursor-pointer"
                  alt={product.name || "Saved product image"}
                />
              </Link>
              <div className="flex justify-between items-center">
                <p className="text-lg">{product.name}</p>
                <button
                  onClick={() =>
                    useUserStore.getState().removeSavedProduct(product.id)
                  }
                  className="text-sm text-gray-500 hover:underline"
                >
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

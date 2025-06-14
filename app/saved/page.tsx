"use client"

import { useUserStore } from "@/stores/userStore"
import { Product } from "@/types/product"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter for navigation
import { useCartStore } from "@/stores/cartStore"

import { Funnel_Display } from "next/font/google"
const funnel_display = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"]
})

export default function SavedItemsPage() {
  const { savedProducts, removeSavedProduct } = useUserStore()
  const { addToCart } = useCartStore()
  const router = useRouter() // Initialize useRouter

  // Handle "Remove" button click
  const handleRemove = (productId: string) => {
    removeSavedProduct(productId)
  }

  // Handle "Purchase" button click (for demonstration, redirects to product page)
  const handlePurchase = (productId: string) => {
    // In a real application, this would typically add the item to a cart
    // and then navigate to a checkout page or the cart page.
    router.push(`/shop/${productId}`)
  }

  return (
    <div className="max-w-6xl mx-auto h-screen px-3 py-20">
      <h1 className={`${funnel_display.className} text-3xl font-bold mb-6`}>
        Saved
      </h1>
      {savedProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t saved any products yet.
        </p>
      ) : (
        <div
          className={`grid gap-1 ${
            savedProducts.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {" "}
          {/* Increased gap for better spacing */}
          {savedProducts.map((product: Product, index: number) => (
            <div key={index} className=" overflow-hidden w-full">
              <Link href={`/shop/${product.id}`} className="block w-full">
                <div
                  className="relative w-full"
                  style={{ paddingBottom: "100%" }}
                >
                  {" "}
                  {/* Aspect ratio box for image */}
                  <Image
                    src={product.imageUrl || "/placeholder.png"}
                    alt={product.name || "Saved product image"}
                    layout="fill" // Makes the image fill the parent container
                    objectFit="cover" // Crops the image to cover the area
                    className="cursor-pointer"
                  />
                </div>
              </Link>
              <div className="px-1 py-2">
                <Link href={`/shop/${product.id}`}>
                  <p className="text-lg font-semibold  hover:text-blue-600 transition-colors cursor-pointer ">
                    {product.name}
                  </p>
                  {product?.subtitle && (
                    <p className=" font-semibold  hover:text-blue-600 transition-colors cursor-pointer ">
                      {product?.subtitle}
                    </p>
                  )}
                </Link>
                {/* You can add product price or other details here if available in your Product type */}
                <p className=" text-lg mb-4">${product.price}</p>

                <div className="flex flex-col w-full gap-4 mt-4">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="flex-1 px-4 py-2 border cursor-pointer border-gray-300   hover:bg-gray-100 transition-colors text-center"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 px-4 py-2 bg-merchant-accent text-gray-800 font-semibold  hover:bg-blue-700 transition-colors cursor-pointer text-center"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

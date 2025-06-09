// app/shop/[id]/page.tsx
"use client"

import React, { useState, useEffect, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  X,
} from "lucide-react"
import { products } from "@/data/products"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"
import { Product } from "@/types/product"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

const DEFAULT_PLACEHOLDER_IMAGES = Array(5).fill("/placeholder-square.png")

export default function ProductDetailPage({
  params: paramsPromise,
}: ProductDetailPageProps) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { favorites, addFavorite, removeFavorite, isAuthenticated } =
    useUserStore()
  const { cartItems, addToCart } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [currentCarouselImageIndex, setCurrentCarouselImageIndex] =
    useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const found = products.find((p) => p.id === params.id)
    if (found) {
      setProduct(found)
      setCurrentCarouselImageIndex(0)
    } else {
      router.push("/")
    }
  }, [params.id, router])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-700">
        <p className="text-xl font-semibold">Loading product...</p>
      </div>
    )
  }

  const isFavorited = () => favorites.includes(product.id)
interface CartItem {
    id: string
    // Add other properties if needed, matching Product if required
}

const isInCart = (): boolean =>
    cartItems.some((item: CartItem) => item.id === product.id)

  const imageList = [
    product.image,
    ...(product.carouselImages?.length
      ? product.carouselImages
      : DEFAULT_PLACEHOLDER_IMAGES),
  ]

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentCarouselImageIndex(
      (currentCarouselImageIndex + 1) % imageList.length
    )
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setCurrentCarouselImageIndex(
      (currentCarouselImageIndex - 1 + imageList.length) % imageList.length
    )
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800">
      {/* Top Bar */}
      <div className="sticky top-0 flex items-center justify-between p-4 bg-white/90 backdrop-blur shadow">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-center flex-grow hidden md:block">
          {product.name}
        </h1>
        <div style={{ width: "2rem" }} />
      </div>

      {/* Carousel */}
      <div className="relative w-full h-[40vh] flex items-center justify-center bg-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={openModal}
        >
          <Image
            src={imageList[currentCarouselImageIndex]}
            fill
            alt={`${product.name} image`}
            className="object-cover"
            priority
          />
        </div>

        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 p-2 bg-white/70 rounded-full shadow hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 p-2 bg-white/70 rounded-full shadow hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Details */}
      <div className="p-6 bg-white rounded-t-3xl h-[50vh] shadow-lg md:mx-auto md:max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-2xl font-semibold text-blue-600">
              ${product.price}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                if (!isAuthenticated()) {
                  alert("Please log in to favorite items!")
                } else {
                  isFavorited()
                    ? removeFavorite(product.id)
                    : addFavorite(product.id)
                }
              }}
              className={`p-3 rounded-full shadow transition-colors ${
                isFavorited()
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart
                fill={isFavorited() ? "currentColor" : "none"}
                strokeWidth={1.5}
                className="w-6 h-6"
              />
            </button>
            <button
              onClick={() => {
                if (isInCart()) {
                  alert("Already in cart!")
                } else {
                  addToCart(product)
                  alert(`${product.name} added to cart!`)
                }
              }}
              className={`p-3 rounded-full shadow ${
                isInCart()
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {isInCart() && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-white text-green-600 border border-green-500 rounded-full text-[0.6rem] font-bold flex items-center justify-center">
                  ✓
                </span>
              )}
            </button>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{product.description}</p>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 p-2 bg-white/30 rounded-full text-white hover:bg-white/50"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          {imageList.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev(e)
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full text-white hover:bg-white/50"
                aria-label="Previous full image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext(e)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full text-white hover:bg-white/50"
                aria-label="Next full image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
          <div
            className="relative w-full h-full max-w-5xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageList[currentCarouselImageIndex]}
              alt={`${product.name} full screen`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// app/shop/[id]/page.tsx
"use client"

import React, { useState, useEffect, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, ShareIcon, X } from "lucide-react"
import { products } from "@/data/products"
import { Product } from "@/types/product"
import { useSwipeable } from "react-swipeable"

import { motion } from "framer-motion"
import { Heart as HeartIcon, ShoppingCart, Bookmark } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"
import { useUserStore } from "@/stores/userStore"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({
  params: paramsPromise
}: ProductDetailPageProps) {
  const params = use(paramsPromise)
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [currentCarouselImageIndex, setCurrentCarouselImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { addToCart, removeItem, cartItems } = useCartStore()
  const { savedProducts, addSavedProduct, removeSavedProduct } = useUserStore()

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    trackMouse: true // optional: enables swipe with mouse drag for testing
  })

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

  const hasCarouselImages = (product.carouselImages ?? []).length > 0

  const imageList = hasCarouselImages
    ? [product.imageUrl, ...(product.carouselImages ?? [])]
    : [product.imageUrl]

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

  const isInCart: boolean = cartItems.some(
    (item: Product) => item.id === product.id
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInCart) {
      removeItem(product.id)
    } else {
      addToCart(product)
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen text-gray-800 pt-[70px]"
    >
      {/* Top Bar */}

      {/* Main Carousel */}
      <div className="w-full  flex flex-col gap-2">
        {/* Main Image */}
        <div
          {...swipeHandlers}
          className="relative w-full h-[50vh] overflow-hidden bg-gray-200 cursor-pointer"
          onClick={openModal}
        >
          <Image
            src={imageList[currentCarouselImageIndex]}
            alt={`${product.name} image`}
            fill
            className="object-cover transition-all duration-300"
            priority
          />
          {hasCarouselImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrev(e)
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleNext(e)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full shadow hover:bg-white"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Scroll Row */}
        {hasCarouselImages && (
          <div className="flex overflow-x-auto gap-2 px-1">
            {imageList.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentCarouselImageIndex(idx)}
                className={`relative min-w-[4rem] w-20 aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  idx === currentCarouselImageIndex
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3 dark:bg-dark rounded-t-xl h-[50vh] shadow-lg md:mx-auto md:max-w-3xl">
        <div className="flex flex-col-reverse gap-4 justify-between   mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              {product.name}
            </h2>
            <h2 className="text-xl font-semibold leading-tight">
              {product?.subtitle}
            </h2>
            <div className="flex items-center mt-2 w-full ">
              <p className="text-2xl mt-1 font-semibold">${product.price}</p>
              {product?.ogPrice && (
                <div className="bg-red-300 ml-2">
                  <p className="text-lg mt-1 scale-[0.85] font-semibold">
                    ${product?.ogPrice} <span className="text-xs">MSRP</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-1 text-gray-800">
            <button
              onClick={() => {
                if (savedProducts.includes(product.id)) {
                  removeSavedProduct(product.id)
                } else {
                  addSavedProduct(product.id)
                }
              }}
              type="button"
              className={`${
                savedProducts.includes(product.id) && "fill-red-500"
              } border px-2 py-1.5 flex cursor-pointer items-center justify-center font-500] gap-2 flex-1 bg-white"`}
            >
              <HeartIcon
                size={22}
                className={
                  savedProducts.includes(product.id)
                    ? "text-red-500 fill-red-500"
                    : ""
                }
              />
              <span>
                {savedProducts.includes(product.id) ? "Saved" : "Save"}
              </span>
            </button>
            <button
              onClick={handleAddToCart}
              type="button"
              className={`border  px-2 py-1.5 flex items-center justify-center gap-2 flex-1  cursor-pointer whitespace-nowrap font-[500] ${
                isInCart
                  ? "bg-merchant-accent border-merchant-accent text-white"
                  : " text-gray-800"
              }`}
            >
              <ShoppingCart size={22} />
              <span>{isInCart ? "In the cart" : "Add to cart"}</span>
            </button>
          </div>
        </div>
        <p className="text-[18px] leading-snug">{product.description}</p>
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
          {hasCarouselImages && (
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
            className="relative w-full h-full max-w-5xl overflow-hidden rounded-md max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={imageList[currentCarouselImageIndex]}
              alt={`${product.name} full screen`}
              fill
              className="object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

// app/shop/[id]/page.tsx
"use client"

import React, { useState, useEffect, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { products } from "@/data/products"
import { Product } from "@/types/product"
import { useSwipeable } from "react-swipeable"
import { ProductActions } from "@/components/product-actions"
import { motion } from "framer-motion"

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

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen text-gray-800 pt-[78px]"
    >
      {/* Top Bar */}

      {/* Main Carousel */}
      <div className="w-full p-3 flex flex-col gap-2">
        {/* Main Image */}
        <div
          {...swipeHandlers}
          className="relative w-full h-[50vh] rounded-md overflow-hidden bg-gray-200 cursor-pointer"
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
      <div className="p-4 bg-[#2C2C2C] rounded-t-xl h-[50vh] shadow-lg md:mx-auto md:max-w-3xl">
        <div className="flex justify-between text-white items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="text-xl font-semibold">${product.price}</p>
          </div>
          <div className="flex space-x-4">
            <ProductActions product={{ ...product, price: String(product.price) }} />
          </div>
        </div>
        <p className="text-white">{product.description}</p>
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

"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSwipeable } from "react-swipeable"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { ProductActions } from "./product-actions"
import type { Product } from "../types/product"

interface ProductFullScreenViewProps {
  products: Product[]
  onClose: () => void
  selectedCategory?: string
}

export default function ProductFullScreenView({
  products,
  selectedCategory = "All",
  onClose
}: ProductFullScreenViewProps) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory)

  // Track carousel index per product by product.id
  const [carouselIndexes, setCarouselIndexes] = useState<
    Record<string, number>
  >({})

  const handleNext = (productId: string, imageList: string[]) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] ?? 0) + 1) % imageList.length
    }))
  }

  const handlePrev = (productId: string, imageList: string[]) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]:
        (prev[productId] ?? 0) === 0
          ? imageList.length - 1
          : (prev[productId] ?? 0) - 1
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto snap-y snap-mandatory"
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full"
      >
        <X className="w-6 h-6 text-black" />
      </button>

      {filteredProducts.map((product) => {
        const imageList = [product.imageUrl, ...(product.carouselImages ?? [])]
        const currentIndex = carouselIndexes[product.id] ?? 0
        const hasCarouselImages = imageList.length > 1

        const swipeHandlers = useSwipeable({
          onSwipedLeft: () => handleNext(product.id, imageList),
          onSwipedRight: () => handlePrev(product.id, imageList),
          trackMouse: true
        })

        return (
          <div
            key={product.id}
            className="relative w-full h-screen snap-start bg-black overflow-hidden"
          >
            <Link href={`/shop/${product.id}`} passHref>
              <div className="w-full flex flex-col gap-2">
                <div
                  {...swipeHandlers}
                  className="relative w-full h-[100vh] rounded-md overflow-hidden bg-gray-200 cursor-pointer"
                >
                  <Image
                    src={imageList[currentIndex]}
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
                          e.preventDefault()
                          handlePrev(product.id, imageList)
                        }}
                        className="absolute left-3 bottom-30 p-2 bg-white/70 rounded-full shadow hover:bg-white"
                      >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          handleNext(product.id, imageList)
                        }}
                        className="absolute right-3 bottom-30 p-2 bg-white/70 rounded-full shadow hover:bg-white"
                      >
                        <ChevronRight className="w-6 h-6 text-gray-700" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Link>

            <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col items-center justify-center space-y-4 z-10">
              <ProductActions
                product={{ ...product, price: String(product.price) }}
                direction="col"
              />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

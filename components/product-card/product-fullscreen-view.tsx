"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { ProductActions } from "./product-actions"
import type { Product } from "@/types/product"

interface ProductFullScreenViewProps {
  products: Product[]
  onClose: () => void
  selectedCategory?: string
  initialProductId?: string
}

export default function ProductFullScreenView({
  products,
  selectedCategory = "All",
  onClose,
  initialProductId
}: ProductFullScreenViewProps) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const [currentProductIndex, setCurrentProductIndex] = useState(() => {
    if (initialProductId) {
      const i = filteredProducts.findIndex((p) => p.id === initialProductId)
      return i >= 0 ? i : 0
    }
    return 0
  })

  const [carouselIndexes, setCarouselIndexes] = useState<
    Record<string, number>
  >({})
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollToCurrent = () => {
      const el = containerRef.current?.children[
        currentProductIndex
      ] as HTMLElement
      if (el) {
        containerRef.current?.scrollTo({
          top: el.offsetTop,
          behavior: "smooth"
        })
      }
    }
    scrollToCurrent()
  }, [currentProductIndex, filteredProducts])

  const handleNextImage = (productId: string, imageList: string[]) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]: ((prev[productId] ?? 0) + 1) % imageList.length
    }))
  }

  const handlePrevImage = (productId: string, imageList: string[]) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [productId]:
        (prev[productId] ?? 0) === 0
          ? imageList.length - 1
          : (prev[productId] ?? 0) - 1
    }))
  }

  if (filteredProducts.length === 0) {
    return (
      <motion.div className="fixed inset-0 z-50 bg-black flex items-center justify-center text-white">
        <p>No products found in this category.</p>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full"
        >
          <X className="w-6 h-6 text-black" />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.2, ease: "easeInOut", delay: 0.1 }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto snap-y snap-mandatory"
      ref={containerRef}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white rounded-full"
        aria-label="Close Full Screen View"
      >
        <X className="w-6 h-6 text-black" />
      </button>

      {filteredProducts.map((product) => {
        const imageList = [product.imageUrl, ...(product.carouselImages ?? [])]
        const currentImageIndex = carouselIndexes[product.id] ?? 0
        const hasCarouselImages = imageList.length > 1

        return (
          <div
            key={product.id}
            className="relative w-full h-screen snap-center bg-black flex items-center justify-center"
          >
            {/* IMAGE + ARROWS */}
            <div className="relative w-full h-full">
              <Link href={`/shop/${product.id}`}>
                <Image
                  src={imageList[currentImageIndex]}
                  alt={`${product.name} image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </Link>
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
              {/* Carousel Navigation */}
              {hasCarouselImages && (
                <>
                  <button
                    onClick={() => handlePrevImage(product.id, imageList)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full hover:bg-white z-20"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleNextImage(product.id, imageList)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/70 rounded-full hover:bg-white z-20"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                    {imageList.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === currentImageIndex ? "bg-white" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* DETAILS */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white  z-30">
              <Link href={`/shop/${product.id}`} passHref>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className="text-xl font-semibold ">${product.price}</p>
                </div>
                <p className="text-[17px] font-500] text-gray-200 mb-4 line-clamp-3">
                  {product.description || "No description available."}
                </p>
              </Link>

              <ProductActions
                product={{ ...product, price: String(product.price) }}
                direction="row"
                showDetailsButton
              />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

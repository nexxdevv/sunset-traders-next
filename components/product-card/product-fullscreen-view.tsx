"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ShoppingCart, X } from "lucide-react"
import type { Product } from "@/types/product"
import { useUserStore } from "@/stores/userStore"
import { useCartStore } from "@/stores/cartStore"

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
  const { cartItems, addToCart, removeItem } = useCartStore()
  const { addSavedProduct, removeSavedProduct, savedProducts } = useUserStore(
    (state) => state
  )
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const [currentProductIndex, _setCurrentProductIndex] = useState(() => {
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

  const handleAddToCart = (product: Product) => {
    if (cartItems.some((item: Product) => item.id === product.id)) {
      removeItem(product.id)
    } else {
      addToCart(product)
    }
  }

  const isInCart = cartItems.some(
    (item: Product) => item.id === filteredProducts[currentProductIndex]?.id
  )

  if (filteredProducts.length === 0) {
    return (
      <motion.div className="fixed top-[190px] inset-x-0 h-[calc(100vh-70px)] z-50 bg-black flex items-center justify-center text-white">
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
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    {product.subtitle && (
                      <h2 className="text-lg leading-tight font-semibold">
                        {product?.subtitle}
                      </h2>
                    )}
                  </div>
                  <p className="text-xl font-semibold ">${product.price}</p>
                </div>
                <p className="text-[17px] font-500] text-gray-200 mb-4 line-clamp-3">
                  {product.description || "No description available."}
                </p>
              </Link>

              <div className="flex gap-1 items-center justify-between">
                <button
                  onClick={() => {
                    if (savedProducts.includes(product.id)) {
                      removeSavedProduct(product.id)
                    } else {
                      addSavedProduct(product.id)
                    }
                  }}
                  type="button"
                  className={`border px-2 font-[500] h-10 cursor-pointer flex items-center justify-center w-1/2 ml-auto text-sm ${
                    savedProducts.includes(product.id)
                      ? "bg-black border-black/50 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <span>
                    {savedProducts.includes(product.id) ? "Saved" : "Save"}
                  </span>
                </button>
                <button
                  onClick={() => handleAddToCart(product)}
                  type="button"
                  className={`border px-2 font-[500]  h-10 cursor-pointer flex gap-1 items-center justify-center w-1/2 ml-auto text-sm ${
                    isInCart
                      ? "bg-merchant-accent border-merchant-accent text-white"
                      : " text-gray-800 bg-white"
                  }`}
                >
                  <ShoppingCart size={22} />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

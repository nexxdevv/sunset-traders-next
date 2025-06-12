"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProductCard from "./product-card/product-card-grid"
import ProductFullScreenView from "./product-card/product-fullscreen-view"
import { Product } from "@/types/product"
import ViewToggleButton from "./ui/view-toggle-button"

type ViewMode = "grid" | "fullscreen"

interface ProductDisplayProps {
  products: Product[]
  selectedCategory: string
}

export default function ProductDisplay({
  products,
  selectedCategory
}: ProductDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory)

  const handleCloseFullScreen = () => {
    setViewMode("grid")
    setSelectedProductId(null)
  }

  const toggleViewMode = () => {
    if (viewMode === "grid") {
      setSelectedProductId(products[0]?.id || null)
      setViewMode("fullscreen")
    } else {
      handleCloseFullScreen()
    }
  }

  useEffect(() => {
    const stillExists = products.some((p) => p.id === selectedProductId)
    if (!stillExists) {
      setSelectedProductId(null)
      setViewMode("grid")
    }
  }, [products, selectedProductId])

  return (
    <div className="relative min-h-screen pt-[136px] text-gray-900 p-3 scrollbar-hide z-50 w-full">
      <div className="mb-4 flex justify-end w-full">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {filteredProducts.length} products
        </p>
      </div>
      <ViewToggleButton viewMode={viewMode} toggleViewMode={toggleViewMode} />

      <AnimatePresence>
        {viewMode === "grid" && (
          <motion.div
            key="product-grid"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 scrollbar-hide min-w-full"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {viewMode === "fullscreen" && (
          <ProductFullScreenView
            key="product-fullscreen"
            selectedCategory={selectedCategory}
            onClose={handleCloseFullScreen}
            initialProductId={selectedProductId ?? undefined}
            products={filteredProducts}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

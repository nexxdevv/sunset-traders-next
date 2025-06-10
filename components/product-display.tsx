"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ProductCard from "./product-card"
import ProductFullScreenView from "./product-fullscreen-view"
import { Product } from "../types/product"
import ViewToggleButton from "./view-toggle-button"

type ViewMode = "grid" | "fullscreen"

interface ProductDisplayProps {
  products: Product[]
  selectedCategory: string
}

export default function ProductDisplay({
  products,
  selectedCategory
}: ProductDisplayProps) {
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null

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

  return (
    <div className="relative min-h-screen pt-16  dark:bg-gray-900 text-gray-900  dark:text-gray-100 p-3 scrollbar-hide ">
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24 scrollbar-hide"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price.toString()
                }}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {viewMode === "fullscreen" && selectedProduct && (
          <ProductFullScreenView
            key="product-fullscreen"
            products={products}
            onClose={handleCloseFullScreen}
            selectedCategory={selectedCategory}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

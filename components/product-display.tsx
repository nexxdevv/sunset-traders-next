"use client"

import { motion } from "framer-motion"
import ProductCard from "./product-card/product-card-grid"
import { Product } from "@/types/product"

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

  return (
    <div className="relative min-h-screen pt-[115px] text-gray-900 p-3 scrollbar-hide z-50 w-full">
      <div className="mb-4 flex justify-end w-full">
        <p className="dark:text-gray-400 text-gray-900/70 text-sm">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <motion.div
        key="product-grid"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut"
        }}
        className="grid grid-cols-2 md:grid-cols-3 items-stretch lg:grid-cols-4 gap-1 scrollbar-hide min-w-full"
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
    </div>
  )
}

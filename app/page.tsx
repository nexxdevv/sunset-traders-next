"use client"

import React, { useState } from "react"
import CategorySelector from "@/components/category-selector"
import { products } from "@/data/products"
import ProductDisplay from "@/components/product-display"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  return (
    <main className="min-h-screen flex items-center justify-center scrollbar-hide">
      <CategorySelector
        categories={products
          .map((product) => product.category)
          .filter((value, index, self) => self.indexOf(value) === index)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <ProductDisplay products={products} selectedCategory={selectedCategory} />
    </main>
  )
}

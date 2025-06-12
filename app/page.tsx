"use client"

import React, { useState } from "react"
import CategorySelector from "@/components/category-selector"
import ProductDisplay from "@/components/product-display"
import { products } from "@/data/products"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  return (
    <main className="min-h-screen scrollbar-hide">
      <CategorySelector
        categories={[
          "All",
          ...products
            .map((product) => product.category)
            .filter((value, index, self) => self.indexOf(value) === index)
        ]}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <ProductDisplay products={products} selectedCategory={selectedCategory} />
    </main>
  )
}

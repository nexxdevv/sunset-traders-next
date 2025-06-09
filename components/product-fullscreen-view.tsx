"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { ProductActions } from "./product-actions"

import type { Product } from "../types/product"

interface ProductFullScreenViewProps {
  products: Product[]
  onClose: () => void
  selectedCategory?: string
}

export default function ProductFullScreenView({
  products,
  selectedCategory
}: ProductFullScreenViewProps) {

  

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75, transition: { duration: 0.3 } }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
      className="fixed inset-0 z-50 bg-black overflow-y-auto snap-y snap-mandatory"
    >
      {filteredProducts.map((product) => (
        <div
          key={product.id}
          className="relative w-full h-screen snap-start bg-black overflow-hidden"
        >
          {/* Clickable Link Wrapper only around Image + Details */}
          <Link href={`/shop/${product.id}`} passHref>
            <div className="absolute inset-0 z-0">
              {/* Fullscreen Image */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover w-full h-full"
                priority
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/10" />
              {/* Product Details Fixed to Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/70 to-transparent">
                <h2 className="font-semibold text-[1.1rem] leading-tight">
                  {product.name}
                </h2>
                <p className="font-semibold leading-tight">${product.price}</p>
                <p className="mt-1">{product.description}</p>
              </div>
            </div>
          </Link>

          {/* Floating Buttons (Not inside Link) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3 flex flex-col items-center justify-center space-y-4 z-10">
            <ProductActions product={product} direction="col" />
          </div>
        </div>
      ))}
    </motion.div>
  )
}

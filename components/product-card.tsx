"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ProductActions } from "@/components/product-actions"
import { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div className="    overflow-hidden transition-all w-full">
      <Link
        href={`/shop/${product.id}`}
        className="relative block w-full aspect-square"
      >
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover rounded-md  w-full"
          priority={index < 4}
        />
      </Link>

      <div className="flex flex-col justify-between gap-2 p-4">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {product.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            ${product.price}
          </p>
        </div>
        <div className="mt-2">
          <ProductActions
            product={{ ...product, price: String(product.price) }}
          />
        </div>
      </div>
    </motion.div>
  )
}

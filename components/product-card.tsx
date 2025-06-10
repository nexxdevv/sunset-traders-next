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
    <Link href={`/shop/${product.id}`}>
      <motion.div
        layoutId={`product-card-${product.id}`}
        className="relative flex flex-col items-center justify-center
                   bg-white dark:bg-gray-800 rounded-lg overflow-hidden
                   shadow-lg hover:shadow-xl cursor-pointer aspect-square"
        tabIndex={0}
        role="link"
      >
        <div className="absolute top-2 left-2 right-2 z-10 flex  gap-3 px-2">
          <ProductActions product={product} size="sm" />
        </div>

        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-full object-cover"
          priority={index < 4}
        />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/40 to-transparent text-white">
          <h3 className=" leading-tight font-semibold">{product.name}</h3>
          <p className="font-medium">${product.price}</p>
        </div>
      </motion.div>
    </Link>
  )
}

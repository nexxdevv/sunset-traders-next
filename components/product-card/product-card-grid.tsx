"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types/product"
import { Tsukimi_Rounded } from "next/font/google"
import { useUserStore } from "@/stores/userStore"
const tsukimi = Tsukimi_Rounded({ weight: "400", subsets: ["latin"] })

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCardGrid({ product, index }: ProductCardProps) {
  const { savedProducts, addSavedProduct, removeSavedProduct } = useUserStore()
  return (
    <motion.div className="overflow-hidden transition-all w-full">
      <Link
        href={`/shop/${product.id}`}
        className="relative block w-full aspect-square rounded-md"
      >
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover  w-full"
          priority={index < 4}
        />
      </Link>

      <div className="flex flex-col items-start gap-1 pb-3 px-1 pt-1">
        <button
          onClick={() => {
            if (savedProducts.includes(product.id)) {
              removeSavedProduct(product.id)
            } else {
              addSavedProduct(product.id)
            }
          }}
          type="button"
          className={`border px-2 font-[500] py-1.5 cursor-pointer flex items-center justify-center w-1/2 -translate-y-5  ml-auto text-sm ${
            savedProducts.includes(product.id)
              ? "bg-black border-black/50 text-white "
              : "bg-white"
          }`}
        >
          <span>{savedProducts.includes(product.id) ? "Saved" : "Save"}</span>
        </button>
        <h3 className="font-semibold -mt-2 text-gray-800 w-full leading-tight dark:text-white">
          {product.name}
        </h3>
        {product.subtitle && (
          <h4 className="font-semibold text-gray-800 w-full leading-tight text-sm dark:text-white">
            {product?.subtitle}
          </h4>
        )}
        <div className="flex mt-4 justify-between items-center w-full">
          <div className="relative">
            <p
              className={`${tsukimi.className}text-gray-800 font-[500] text-[17px] dark:text-gray-400`}
            >
              ${product.price}
            </p>
          </div>
          <Link
            href={`/shop/${product.id}`}
            className="border px-2 py-1.5  cursor-pointer bg-white flex items-center justify-center gap-2 w-auto ml-auto text-sm"
          >
            More Details
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

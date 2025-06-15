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
  const saveProductToggle = (product: Product) => {
    if (
      savedProducts.some(
        (savedProduct: Product) => savedProduct.id === product.id
      )
    ) {
      removeSavedProduct(product.id)
    } else {
      addSavedProduct(product)
    }
  }
  return (
    <motion.div
      key={product.id}
      id={product.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.6 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
        delay: index * 0.1,
        staggerChildren: 0.1
      }}
      className="overflow-hidden  w-full h-full flex flex-col "
    >
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

      <div className="flex flex-col justify-between flex-grow pb-3 px-1 pt-1 gap-3">
        <button
          onClick={() => saveProductToggle(product)}
          type="button"
          className={`border px-2 transition-all duration-300 py-1.5 cursor-pointer flex items-center justify-center w-1/2 -translate-y-5 ml-auto text-sm shadow-sm ${
            savedProducts.some(
              (savedProduct: Product) => savedProduct.id === product.id
            )
              ? "bg-red-500 border-red-500/50 text-white font-[600]"
              : "bg-white text-gray-700/90 font-[500]"
          }`}
        >
          <span>
            {savedProducts.some(
              (savedProduct: Product) => savedProduct.id === product.id
            )
              ? "Saved"
              : "Save"}
          </span>
        </button>
        <div className="flex flex-col justify-between gap-4 -mt-4">
          <div className="flex flex-col h-full">
            <h3 className="font-semibold  text-gray-800 w-full leading-tight dark:text-white">
              {product.name}
            </h3>
            {product.subtitle && (
              <h4 className="font-semibold text-gray-800 w-full leading-tight text-sm dark:text-white">
                {product?.subtitle}
              </h4>
            )}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="relative">
              <p
                className={`${tsukimi.className}text-gray-800 dark:text-gray-200 font-[500] text-[17px]`}
              >
                ${product.price}
              </p>
            </div>
            <Link
              href={`/shop/${product.id}`}
              className=" px-3 py-1.5  cursor-pointer bg-merchant-accent flex items-center justify-center gap-2 w-auto ml-auto text-sm  font-[500]"
            >
              More details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

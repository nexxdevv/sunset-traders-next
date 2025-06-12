// components/SearchOverlay.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/types/product"

interface SearchOverlayProps {
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  suggestions: string[]
  matchedProducts: Product[]
}

export default function SearchOverlay({
  searchOpen,
  setSearchOpen,
  searchTerm,
  setSearchTerm,
  suggestions,
  matchedProducts
}: SearchOverlayProps) {
  return (
    <AnimatePresence>
      {searchOpen && (
        <>
          <motion.div
            key="search-underlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-30"
            onClick={() => setSearchOpen(false)}
          />
          <motion.div
            key="search-overlay"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-40 bg-[#365DB6] bg-opacity-90 backdrop-blur-md p-4 text-white"
          >
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full py-2 px-4 bg-white rounded-md border focus:outline-none text-gray-900" // Added text-gray-900 for input clarity
            />
            <div className="mt-2 max-h-60 overflow-y-auto">
              {suggestions.map((s) => (
                <div
                  key={s}
                  className="py-1 px-2 text-white hover:bg-white/20 cursor-pointer rounded-md" // Adjusted hover color
                  onClick={() => setSearchTerm(s)}
                >
                  {s}
                </div>
              ))}
              {matchedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.id}`}
                  onClick={() => setSearchOpen(false)} // Close search on product click
                >
                  <div className="flex items-center gap-2 py-2 px-2 text-white hover:bg-white/20 cursor-pointer rounded-md">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                    <span>{p.name}</span>
                  </div>
                </Link>
              ))}
              {searchTerm && (
                <Link
                  href={`/search/${encodeURIComponent(searchTerm)}`}
                  onClick={() => setSearchOpen(false)} // Close search on global search click
                >
                  <div className="py-2 px-2 text-white font-semibold hover:underline mt-2">
                    Search for &quot;{searchTerm}&quot;
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

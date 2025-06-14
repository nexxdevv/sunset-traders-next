// app/search/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { products } from "@/data/products" // your product data
import Link from "next/link"
import Image from "next/image"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState(products)
  const [showNoResults, setShowNoResults] = useState(false)

  useEffect(() => {
    const filtered = products.filter((product) => {
      const lower = query.toLowerCase()
      return (
        product.name.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower) ||
        product.tags?.some((tag: string) => tag.toLowerCase().includes(lower))
      )
    })

    setResults(filtered)
    setShowNoResults(query.length > 0 && filtered.length === 0)
  }, [query])

  const showSuggestions = query.length === 0

  return (
    <div className="max-w-3xl mx-auto p-6 ">

      <Input
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-6 bg-white"
      />

      {showSuggestions && (
        <>
          <h2 className="text-lg font-semibold mb-2">Popular Searches</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {["shoes", "hat", "spray", "backpack", "eco"].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-gray-300"
              >
                {term}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-2">Suggested Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products
              .sort(() => 0.5 - Math.random())
              .slice(0, 6)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="block border rounded hover:shadow transition"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-36 object-cover rounded-t"
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-600">${product.price}</p>
                  </div>
                </Link>
              ))}
          </div>
        </>
      )}

      {!showSuggestions && (
        <>
          <p className="text-sm text-gray-500 mb-2">
            {results.length} result{results.length !== 1 && "s"} found
          </p>
          {showNoResults ? (
            <p className="text-center text-gray-500 mt-10">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="block border rounded hover:shadow transition"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full  object-cover rounded-t"
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-gray-600">${product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

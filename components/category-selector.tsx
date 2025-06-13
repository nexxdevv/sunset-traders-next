"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Space_Grotesk } from "next/font/google"

const luckSpace_Grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "700"]
})

interface CategorySelectorProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory
}: CategorySelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  // Center the active button when it changes
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const button = activeButtonRef.current
      const containerWidth = container.offsetWidth
      const buttonLeft = button.offsetLeft
      const buttonWidth = button.offsetWidth

      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth"
      })
    }
  }, [selectedCategory])

  return (
    <div
      ref={scrollContainerRef}
      className="flex fixed top-[53px] left-0 right-0 items-center overflow-x-auto pt-4 pb-8  scrollbar-hide overflow-y-hidden z-[60]"
    >
      {categories.map((category) => {
        const isActive = category === selectedCategory
        return (
          <button
            key={category}
            ref={isActive ? activeButtonRef : null}
            onClick={() => onSelectCategory(category)}
            className={cn(
              `${luckSpace_Grotesk.className} uppercase cursor-pointer px-4 py-1.5  text-[15px] whitespace-nowrap font-[600]`,
              isActive
                ? "bg-merchant-accent text-white "
                : "bg-white"
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

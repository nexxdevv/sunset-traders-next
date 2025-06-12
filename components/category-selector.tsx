"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

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
      className="flex fixed top-[70px] left-0 right-0 items-center gap-2 overflow-x-auto pt-4 pb-2 px-3 scrollbar-hide overflow-y-hidden z-[60]"
    >
      {categories.map((category) => {
        const isActive = category === selectedCategory
        return (
          <button
            key={category}
            ref={isActive ? activeButtonRef : null}
            onClick={() => onSelectCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all capitalize duration-700 ease-in-out text-gray-700",
              isActive ? "bg-[#365DB6] text-white" : "bg-gray-100   "
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}

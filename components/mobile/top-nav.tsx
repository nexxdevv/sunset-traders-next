// components/TopNav.tsx
"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores/cartStore"
import { Funnel_Display } from "next/font/google"
import { Work_Sans } from "next/font/google"
import { motion, AnimatePresence } from "framer-motion"

// Import the new components and hook
import { useAuth } from "@/hooks/useAuth"
import MobileMenu from "@/components/mobile/mobile-menu"
import SearchOverlay from "@/components/mobile/search-overlay"
import CartDrawer from "@/components/mobile/cart-drawer"

// Assuming these imports are correct
import { products as inventory } from "@/data/products"
import { Product } from "@/types/product" // Ensure Product type is imported

const funnel_display = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"]
})

const geologica = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "700"]
})

interface CartItem {
  // Keep CartItem here or in a shared types file
  id: string
  name: string
  price: number
  imageUrl: string
  quantity: number
}

interface CartStore {
  // Keep CartStore here or in a shared types file
  cartItems: CartItem[]
  removeItem: (id: string) => void
}

export default function TopNav() {
  const { user, handleGoogleSignIn, handleSignOut } = useAuth() // Use the custom auth hook

  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([])

  const { cartItems, removeItem }: CartStore = useCartStore()
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  // Effect for search functionality (remains in TopNav as it controls search state)
  useEffect(() => {
    if (!searchTerm) return setSuggestions([]), setMatchedProducts([])
    const term = searchTerm.toLowerCase()
    const names = inventory.map((p) => p.name)
    setSuggestions(
      Array.from(
        new Set(names.filter((n) => n.toLowerCase().includes(term)).slice(0, 5))
      ) // Ensure case-insensitive suggestion
    )

    setMatchedProducts(
      inventory
        .filter((p) => p.name.toLowerCase().includes(term))
        .sort(
          (a, b) =>
            a.name.toLowerCase().indexOf(term) -
            b.name.toLowerCase().indexOf(term)
        )
        .slice(0, 5)
    )
  }, [searchTerm])

  // Handlers to close other panels when one opens
  const toggleMenu = () => {
    if (cartOpen) setCartOpen(false)
    setMenuOpen((prev) => !prev)
  }

  const toggleCart = () => {
    if (menuOpen) setMenuOpen(false)
    setCartOpen((prev) => !prev)
  }

  const openSearch = () => {
    setSearchOpen(true)
    if (menuOpen) setMenuOpen(false) // Close menu if open when search opens
    // Optional: close cart if open when search opens
    if (cartOpen) setCartOpen(false)
  }

  return (
    <header
      className="fixed top-0 z-[80] w-full h-[70px] flex items-center justify-between bg-white 
             
             px-3"
    >
      {/* Left: Menu Button */}
      <button
        onClick={toggleMenu}
        className=" md:hidden cursor-pointer"
        aria-label="Toggle Menu"
      >
        {menuOpen ? (
          <X size={30} className="text-gray-800" />
        ) : (
          <Menu size={30} className="text-gray-800" />
        )}
      </button>

      {/* Center: Logo */}
      <div className="absolute text-gray-800 left-1/2 transform text-center -translate-x-1/2 -translate-y-[8px]">
        <Link href="/" className="relative block h-full w-full">
          <div className="relative inline-block">
            <h1
              className={`${funnel_display.className} leading-tight scale-[.82] text-5xl font-extrabold tracking-tight`}
            >
              Sunset
            </h1>
          </div>
          <p
            className={`${geologica.className} leading-tight font-[400] -mt-[15px] uppercase text-sm tracking-[0.18em] scale-[.87]`}
          >
            Traders<span className="text-xs">&copy;</span>
          </p>
        </Link>
      </div>

      {/* Right: Search & Cart Icons */}
      <div className="flex items-center gap-6">
        <button
          className="cursor-pointer"
          onClick={openSearch}
          aria-label="Search"
        >
          <Search size={23} className="text-gray-800" />
        </button>
        <button onClick={toggleCart} aria-label="Cart" className="relative">
          <ShoppingCart size={23} className="text-gray-800 cursor-pointer" />
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.span
                key="cart-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`absolute -bottom-2  -right-2.5 bg-merchant-accent  text-xs rounded-full w-5 h-5 flex items-center  justify-center font-bold scale-[.9] `}
              >
                {cartItems.length}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Render the extracted components */}
      <SearchOverlay
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        suggestions={suggestions}
        matchedProducts={matchedProducts}
      />

      <MobileMenu
        user={user}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        handleGoogleSignIn={handleGoogleSignIn}
        handleSignOut={handleSignOut}
      />

      <CartDrawer
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        removeItem={removeItem}
        total={total}
      />
    </header>
  )
}

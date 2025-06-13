// components/TopNav.tsx
"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores/cartStore"
import { Funnel_Display } from "next/font/google"

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
    <header className="fixed top-0 z-[80] w-full bg-merchant  px-3 h-[70px] flex items-center justify-between">
      {/* Left: Menu Button */}
      <button
        onClick={toggleMenu}
        className=" md:hidden cursor-pointer"
        aria-label="Toggle Menu"
      >
        {menuOpen ? (
          <X size={30} className="text-white" />
        ) : (
          <Menu size={30} className="text-white" />
        )}
      </button>

      {/* Center: Logo */}
      <div className="absolute text-white left-1/2 transform text-center -translate-x-1/2 -translate-y-[8px]">
        <Link href="/" className="relative block h-full w-full">
          <div className="relative inline-block">
            <h1
              className={`${funnel_display.className} leading-tight scale-[.82] text-5xl font-extrabold tracking-tight`}
            >
              Sunset
            </h1>
          </div>
          <p className="leading-tight font-normal -mt-[16px] uppercase text-sm tracking-[0.12em] scale-[.89]">
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
          <Search size={23} className="text-white" />
        </button>
        <button onClick={toggleCart} aria-label="Cart" className="relative">
          <ShoppingCart size={23} className="text-white cursor-pointer" />
          {cartItems.length > 0 && (
            <span className="absolute -bottom-2 -right-2.5 bg-merchant-accent text-white text-xs rounded-full w-5 h-5 flex items-center  justify-center font-bold scale-[.9]">
              {cartItems.length}
            </span>
          )}
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

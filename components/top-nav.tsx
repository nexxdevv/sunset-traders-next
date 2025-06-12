"use client"

import { useState, useEffect } from "react"
import { Menu, X, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/stores/cartStore"
import { motion, AnimatePresence } from "framer-motion"
import { Funnel_Display } from "next/font/google"
import { Button } from "@/components/ui/button"
import CheckoutButton from "@/components/checkout-button"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { Product } from "@/types/product"
import { products as inventory } from "@/data/products"

const calisMartel = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"]
})

export default function TopNav() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([])
  const { cartItems, removeItem }: CartStore = useCartStore()
  const router = useRouter()
  interface CartItem {
    id: string
    name: string
    price: number
    imageUrl: string
    quantity: number
  }

  interface CartStore {
    cartItems: CartItem[]
    removeItem: (id: string) => void
  }

  const total: number = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0
  )

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      menuOpen && setMenuOpen(false) // Close menu if open
      router.push("/account") // Redirect to account page after sign in
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing in with Google:", error.message)
        alert(`Error signing in: ${error.message}`)
      } else {
        console.error("Error signing in with Google:", error)
        alert("Error signing in. Please try again.")
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error signing out:", error.message)
        alert(`Error signing out: ${error.message}`)
      } else {
        console.error("Unexpected error signing out:", error)
        alert("An unknown error occurred during sign out.")
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      setLoading(false)

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            name: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: new Date().toISOString(),
            favorites: [],
            orders: []
          })
          console.log("✅ New user document created in Firestore")
        } else {
          console.log("👤 Existing user document found")
        }
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!searchTerm) return setSuggestions([]), setMatchedProducts([])
    const term = searchTerm.toLowerCase()
    const names = inventory.map((p) => p.name)
    setSuggestions(
      Array.from(new Set(names.filter((n) => n.includes(term)).slice(0, 5)))
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

  return (
    <header className="fixed top-0 z-[80] w-full bg-[#285EBC] shadow-md px-4 h-[70px] flex items-center justify-between">
      {/* Left: Menu Button */}
      <button
        onClick={() => {
          if (cartOpen) setCartOpen(false)
          setMenuOpen((prev) => !prev)
        }}
        className="p-2 md:hidden cursor-pointer"
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
        <Link href="/" className="text-xl font-bold">
          <h1
            className={`${calisMartel.className} leading-tight scale-[.75] text-5xl font-extrabold tracking-tight`}
          >
            Sunset
          </h1>
          <p className="leading-tight font-normal -mt-[17px] uppercase text-sm tracking-widest scale-[.95]">
            Traders
          </p>
        </Link>
      </div>

      {/* Right: Search & Cart Icons */}
      <div className="flex items-center gap-6">
        <button
          className="cursor-pointer"
          onClick={() => {
            setSearchOpen(true)
            if (menuOpen) setMenuOpen(false)
          }}
          aria-label="Search"
        >
          <Search size={23} className="text-white" />
        </button>
        <button
          onClick={() => {
            if (menuOpen) setMenuOpen(false)
            setCartOpen((prev) => !prev)
          }}
          aria-label="Cart"
        >
          <ShoppingCart size={23} className="text-white cursor-pointer" />
          {cartItems.length > 0 && (
            <span className="absolute top-3 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* {/* Search Overlay */}
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
                className="w-full py-2 px-4 rounded-md border focus:outline-none"
              />
              <div className="mt-2 max-h-60 overflow-y-auto">
                {suggestions.map((s) => (
                  <div
                    key={s}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => setSearchTerm(s)}
                  >
                    {s}
                  </div>
                ))}
                {matchedProducts.map((p) => (
                  <Link key={p.id} href={`/shop/${p.id}`}>
                    <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-200 cursor-pointer">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <span>{p.name}</span>
                    </div>
                  </Link>
                ))}
                {searchTerm && (
                  <Link href={`/search/${encodeURIComponent(searchTerm)}`}>
                    <div className="py-2 px-2 text-white font-semibold hover:underline">
                      Search for "{searchTerm}"
                    </div>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="menu-underlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[70px] bg-black z-30 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              key="mobile-menu"
              initial={{ x: "-100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.9 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              className="fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[90%] bg-[#285EBC] border-t shadow-md z-40 p-4 md:hidden"
            >
              {user ? (
                <div
                  style={{
                    backgroundImage: `url('https://res.cloudinary.com/cloud-x/image/upload/v1749705411/sunset-triangle_zxolkp.png')`
                    // backgroundBlendMode: "multiply"
                  }}
                  className="  rounded-lg max-w-sm w-full mx-auto h-full flex flex-col justify-between"
                >
                  <ul className="mb-8">
                    <Link
                      href="/account"
                      className="block text-xl font-medium text-white py-4 px-4 hover:text-blue-600 transition duration-200 ease-in-out transform hover:translate-x-1 bg-white/30 backdrop-blur-sm rounded-t-lg"
                      onClick={() => setMenuOpen(false)}
                    >
                      Account
                    </Link>
                    <li>
                      <a
                        href="/orders"
                        className="block text-xl font-medium text-white py-4 px-4 hover:text-blue-600 transition duration-200 ease-in-out transform hover:translate-x-1 bg-white/30 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        Orders
                      </a>
                    </li>
                    <li>
                      <a
                        href="/favorites"
                        className="block text-xl font-medium text-white py-4 px-4 hover:text-blue-600 transition duration-200 ease-in-out transform hover:translate-x-1 bg-white/30 backdrop-blur-sm"
                        onClick={() => setMenuOpen(false)}
                      >
                        Favorites
                      </a>
                    </li>
                  </ul>
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-auto inline-flex items-center justify-center bg-red-600/60 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-b-lg text-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 gap-2"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="text-white  max-w-md w-full">
                  <h1 className="text-2xl font-bold mb-4 ">
                    Welcome!
                  </h1>
                  <p className="text-lg  mb-8 leading-relaxed">
                    Sign in or create an account to continue.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-full text-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 gap-2"
                  >
                    <FcGoogle size={28} />
                    Continue with Google
                  </button>
                  <footer className="mt-8">
                    <p className="text-sm text-gray-400 ">
                      By signing in, you agree to our{" "}
                      <a
                        href="/terms"
                        className="text-yellow-600 hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-yellow-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </footer>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              key="cart-underlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-[70px] bg-black z-30"
              onClick={() => setCartOpen(false)}
            />

            <motion.div
              key="cart-drawer"
              initial={{ x: "100%", opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
              className="fixed top-[70px] right-0 h-[calc(100vh-70px)] w-[85%] max-w-md bg-white dark:bg-[#285EBC] shadow-lg z-40 p-4 border-t"
            >
              <div>
                <h1 className="text-3xl font-bold mb-6">Cart</h1>

                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-200 text-lg">
                    Your cart is empty.{" "}
                    <Link
                      href="/"
                      onClick={() => setCartOpen(false)}
                      className="text-yellow-500 underline"
                    >
                      Continue shopping
                    </Link>
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Items Section */}
                    <div className="md:col-span-2 space-y-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col justify-between w-full gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                        >
                          <div className="flex w-full justify-between">
                            <Image
                              src={item.imageUrl || "/placeholder.png"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover w-20 h-20"
                            />
                            <Button
                              variant="outline"
                              onClick={() => removeItem(item.id)}
                              className="text-sm"
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm leading-tight">
                              {item.name}
                            </h3>
                            <p className="dark:text-gray-300 text-sm">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Section */}
                    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                      <h2 className="text-xl font-semibold mb-4">Summary</h2>
                      <div className="flex justify-between mb-2">
                        <span>Items</span>
                        <span>{cartItems.length}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Total</span>
                        <span className="font-bold">${Number(total)}</span>
                      </div>
                      <CheckoutButton cartItems={cartItems} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

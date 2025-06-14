// components/MobileMenu.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import { User } from "firebase/auth"
import { Inter } from "next/font/google" // Using Inter for a clean, modern sans-serif look

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

interface MobileMenuProps {
  user: User | null
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  handleGoogleSignIn: () => Promise<void>
  handleSignOut: () => Promise<void>
}

export default function MobileMenu({
  user,
  menuOpen,
  setMenuOpen,
  handleGoogleSignIn,
  handleSignOut
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {menuOpen && (
        <>
          {/* Underlay with more subtle backdrop blur */}
          <motion.div
            key="menu-underlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-[69px] bg-black/20 backdrop-blur-md z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "easeOut", duration: 0.3 }} // Smoother transition
            className={`fixed top-[69px] left-0 h-[calc(100vh-70px)] w-[85%] bg-white dark:bg-dark shadow-xl z-40 md:hidden ${inter.variable} font-sans`}
          >
            {/* Menu Content */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between py-8 px-6">
              {user ? (
                <>
                  <div className="flex flex-col items-center justify-center mb-8">
                    <Image
                      src={user.photoURL || "https://via.placeholder.com/150"}
                      alt={user.displayName || "User Avatar"}
                      width={70}
                      height={70}
                      className="rounded-full object-cover mb-4 border border-gray-200"
                    />
                    <p className="text-xl font-semibold text-gray-800 dark:text-white text-center">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-white text-center">
                      {user.email}
                    </p>
                  </div>
                  <nav className="flex-grow">
                    <ul className="flex flex-col gap-1">
                      <li>
                        <Link
                          href="/orders"
                          className="block text-lg text-gray-700 dark:text-white font-medium py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/saved"
                          className="block text-lg text-gray-700 dark:text-white font-medium py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMenuOpen(false)}
                        >
                          Saved Items
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/settings" // Added a settings link for completeness
                          className="block text-lg text-gray-700 dark:text-white font-medium py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setMenuOpen(false)}
                        >
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-6 flex items-center justify-center bg-gray-100 text-gray-700 dark:text-gray-800 font-medium py-3 px-6 rounded-lg shadow-sm hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col  h-full pt-4 pb-6">
                  <p className=" text-gray-500 text-xl font-[500] mb-4">
                    Sign in to purchase or save items in the store.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 gap-3"
                  >
                    <FcGoogle size={24} />
                    Continue with Google
                  </button>
                  <footer className=" pt-3">
                    <p className="text-xs text-gray-500 leading-normal">
                      By signing in, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:underline"
                        onClick={() => setMenuOpen(false)}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                        onClick={() => setMenuOpen(false)}
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </footer>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

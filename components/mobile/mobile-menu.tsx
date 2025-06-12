// components/MobileMenu.tsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { FcGoogle } from "react-icons/fc"
import { User } from "firebase/auth"
import { Shizuru } from "next/font/google"
import { Rubik_Glitch } from "next/font/google"

const shizShizuru = Shizuru({
  subsets: ["latin"],
  weight: ["400"]
})

const rubik_glitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: ["400"]
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
          <motion.div
            key="menu-underlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[70px] bg-black/30 backdrop-blur-lg z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0.9 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
            // You might want to adjust the background and backdrop-filter for the image effect
            className="fixed top-[70px] left-0 h-[calc(100vh-70px)] w-[90%] bg-[#285EBC]  z-40 md:hidden"
          >
            {/* Background Image Container for the menu */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url('https://res.cloudinary.com/cloud-x/image/upload/v1749705411/sunset-triangle_zxolkp.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.6)" // Darken the background image for readability
              }}
            />

            {/* Menu Content with backdrop-filter */}
            <div className="relative z-10  w-full mx-auto h-full flex flex-col justify-between py-6 bg-merchant/60 bg-gradient-to-r from-merchant/50 to-[#285EBC]/20 ">
              {user ? (
                <>
                  <div className="w-full flex flex-col items-center justify-center p-4 mb-4">
                    <Image
                      src={user.photoURL || "https://via.placeholder.com/150"} // Use user's photoURL or a placeholder
                      alt={user.displayName || "User Avatar"}
                      width={100}
                      height={100}
                      className="rounded-full object-cover mx-auto mb-2 border-2 border-white"
                    />
                    <p className="text-white text-lg font-semibold">
                      {user.displayName || "User"}
                    </p>
                  </div>
                  <ul className="mb-8 px-4 flex-grow flex flex-col gap-2 ">
                    {" "}
                    {/* flex-grow to push sign-out to bottom */}
                    <li>
                      <Link
                        href="/account"
                        className="block text-2xl font-medium text-white py-4 px-4  duration-200 ease-in-out transform hover:translate-x-1 rounded-t-lg"
                        onClick={() => setMenuOpen(false)}
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/orders"
                        className="block text-2xl font-medium text-white py-4 px-4  duration-200 ease-in-out transform hover:translate-x-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/saved"
                        className="block text-2xl font-medium text-white py-4 px-4  duration-200 ease-in-out transform hover:translate-x-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        Saved Items
                      </Link>
                    </li>
                  </ul>
                  <button
                    onClick={handleSignOut}
                    className="w-full mt-auto inline-flex items-center justify-center bg-red-400/80 backdrop-blur-sm text-white font-semibold py-3 px-6 text-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 gap-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="text-white  flex flex-col justify-start h-full px-3 max-w-sm">
                  <div className="scale-[.9]">
                    <h1
                      className={`${shizShizuru.className} text-[60px] font-bold rotate-[-9deg] mb-2 leading-[1.1] uppercase`}
                    >
                      Looney Mike's
                    </h1>
                    <h1
                      className={`${rubik_glitch.className} text-[56px] font-bold mb-8 leading-[1.1] uppercase`}
                    >
                      Digital Imporium
                    </h1>
                  </div>
                  <p className="text-lg mb-10 leading-snug">
                    Continue with Google if it was good for you ya greaseball
                    cocksucka mothafucka.
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center justify-center bg-white text-merchant font-semibold py-3 px-6 rounded-full text-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 gap-2 max-w-xs"
                  >
                    <FcGoogle size={28} />
                    Continue with Google
                  </button>
                  <footer className="mt-4">
                    <p className="text-sm text-gray-200">
                      By signing in, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-yellow-400 hover:underline"
                        onClick={() => setMenuOpen(false)}
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-yellow-400 hover:underline"
                        onClick={() => setMenuOpen(false)}
                      >
                        Privacy Policy
                      </Link>
                      . And if you say anything there go ya legs.
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

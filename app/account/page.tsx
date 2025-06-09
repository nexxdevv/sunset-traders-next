// /account/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User, // Import User type
  signOut // Import signOut
} from "firebase/auth"
import { FcGoogle } from "react-icons/fc"
import { FaUserCircle } from "react-icons/fa" // For a user icon

// Assuming your firebase config is set up and exported from this path
import { auth } from "@/lib/firebase" // Adjust this path to your actual Firebase config file
import Image from "next/image"

const AccountPage: React.FC = () => {
  // Use null for user initially to signify no user logged in
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser) // Set the user state
      setLoading(false) // Once auth state is determined, stop loading
    })

    return () => unsubscribe() // Clean up the listener
  }, []) // Empty dependency array means this runs once on mount

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      // The onAuthStateChanged listener will update the 'user' state
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
      // The onAuthStateChanged listener will update the 'user' state to null
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 font-sans text-gray-800">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full animate-pulse ">
          <p className="text-xl text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 font-sans text-gray-800">
      {user ? (
        // User is signed in: Show Dashboard
        <div className="bg-white rounded-3xl shadow-xl p-10  max-w-md w-full">
          <Image
            src={user.photoURL || ""}
            alt={user.displayName || "User"}
            width={200}
            height={200}
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            {user.displayName || "User"}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {user.email}.
          </p>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center justify-center bg-red-500 text-white font-semibold py-3 px-6 rounded-full text-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-300 gap-2"
          >
            Sign Out
          </button>
        </div>
      ) : (
        // User is not signed in: Show Login Screen
        <>
          <div className="bg-white rounded-3xl shadow-xl p-10  max-w-md w-full">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome!</h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Sign in or create an account to continue.
              <br />
              It&apos;s quick and easy with Google!
            </p>
            <button
              onClick={handleGoogleSignIn}
              className="inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-full text-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 gap-2"
            >
              <FcGoogle size={28} />
              Sign in with Google
            </button>
          </div>
          <footer className="mt-8">
            <p className="text-sm text-gray-600 ">
              By signing in, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </footer>
        </>
      )}
    </div>
  )
}

export default AccountPage

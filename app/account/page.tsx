"use client"

import React, { useEffect, useState } from "react"
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut
} from "firebase/auth"
import { FcGoogle } from "react-icons/fc"
import { auth, db } from "@/lib/firebase"
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore"
import Image from "next/image"

interface Order {
  id: string
  total: number
  customer: string
  email: string
  date: string
  items: {
    name: string
    quantity: number
    price: number
    image: string
  }[]
}

const AccountPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])

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

        // Fetch user's orders from global 'orders' collection
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        )
        const querySnapshot = await getDocs(q)
        const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Order)
        }))
        setOrders(fetchedOrders)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 font-sans text-gray-800">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full animate-pulse">
          <p className="text-xl text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 font-sans text-gray-800">
      {user ? (
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full space-y-6">
          <div className="text-center">
            <Image
              src={user.photoURL || ""}
              alt={user.displayName || "User"}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {user.displayName || "User"}
            </h1>
            <p className="text-lg text-gray-600">{user.email}</p>
            <button
              onClick={handleSignOut}
              className="mt-4 inline-flex items-center justify-center bg-red-500 text-white font-semibold py-2 px-5 rounded-full shadow-md hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
            {orders.length > 0 ? (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Order #: {order.id.slice(0, 8)}...
                      </h3>
                    </div>
                    <ul className="space-y-2 pl-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="text-sm">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 font-semibold text-right">
                      Total: ${order.total.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You have no recent orders.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full">
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

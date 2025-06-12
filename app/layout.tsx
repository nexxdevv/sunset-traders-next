"use client"
import "@/app/globals.css"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useUserStore } from "@/stores/userStore"
import TopNav from "@/components/top-nav"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Get the setUser action directly from the store's state
      // This is how you call a Zustand action from outside a React component hook
      useUserStore.getState().setUser(user)
    })

    return () => unsubscribe()
  }, [])
  return (
    <html lang="en" className="scroll-smooth dark">
      <body className="dark:bg-[#171717]  antialiased">
        <TopNav />
        {children}
      </body>
    </html>
  )
}

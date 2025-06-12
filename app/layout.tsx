"use client"
import "@/app/globals.css"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useUserStore } from "@/stores/userStore"
import TopNav from "@/components/mobile/top-nav"


export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      useUserStore.getState().setUser(user)
    })
    return () => unsubscribe()
  }, [])
  return (
    <html lang="en" className="scroll-smooth">
      <body className="dark:bg-dark bg-white antialiased scrollbar-hide">
        <TopNav />
        {children}
      </body>
    </html>
  )
}

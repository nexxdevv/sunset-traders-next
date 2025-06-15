"use client"

import React, { useEffect, useState } from "react"
import { Funnel_Display } from "next/font/google"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useUserStore } from "@/stores/userStore"
import Image from "next/image"
import { motion } from "framer-motion"

const funnel_display = Funnel_Display({
  subsets: ["latin"],
  weight: ["400", "700"]
})

type Order = {
  id: string
  items: {
    name: string
    description?: string
    quantity: number
    price: number
    image: string
  }[]
  total: number
  date: string
  status?: string
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useUserStore()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) return

      const ordersRef = collection(db, "orders")
      const q = query(ordersRef, where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Order[]

      setOrders(data)
    }

    fetchOrders()
  }, [user])

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-6xl mx-auto px-3 py-20"
    >
      <h1 className={`${funnel_display.className} text-3xl font-bold mb-6`}>
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {orders.map((order) => (
            <div key={order.id} className=" flex items-center gap-4 ">
              <Image
                src={order.items[0].image || "/placeholder.png"}
                alt={order.items[0].name || "Product image"}
                width={80}
                height={80}
                className=" object-cover"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{order.items[0].name}</h2>
                {order.items[0].description && (
                  <p className="text-sm text-gray-500 dark:text-gray-200">
                    {order.items[0].description}
                  </p>
                )}
                <p className="text-md text-gray-800 dark:text-white mt-1">
                  ${order.total}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600 dark:text-white">
                  Status:
                </p>
                <p className="text-sm font-semibold text-yellow-600">
                  {order.status || "Processing"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default OrdersPage

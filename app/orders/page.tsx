"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ChevronRight } from "lucide-react"

interface Order {
  id: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  items: number
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    total: 289.98,
    status: "delivered",
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    total: 179.99,
    status: "shipped",
    items: 2,
  },
  {
    id: "ORD-003",
    date: "2024-02-01",
    total: 99.99,
    status: "processing",
    items: 1,
  },
]

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false)
  const { isLoggedIn } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!mounted) {
    return <div className="py-12 text-center">Loading...</div>
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <a href="/shop">Shop Now</a>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-lg">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.items} item{order.items !== 1 ? "s" : ""} • Total: ${order.total.toFixed(2)}
                  </p>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

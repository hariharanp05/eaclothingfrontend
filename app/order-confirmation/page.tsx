"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Package, Truck, Mail } from "lucide-react"

export default function OrderConfirmationPage() {
  const orderNumber = `ORD-${String(Math.random()).slice(2, 10).toUpperCase()}`
  const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-8">
      <Card className="max-w-2xl w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
            <CheckCircle className="h-24 w-24 text-green-500 relative" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        {/* Order Details */}
        <div className="bg-background rounded-lg p-6 mb-8 space-y-4 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-semibold">Order Number</span>
            <span className="text-lg font-mono font-bold text-accent">{orderNumber}</span>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Confirmation Email</p>
              <p className="font-semibold">Sent to your email address</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Order Status</p>
              <p className="font-semibold">Processing</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-semibold">{estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold mb-3">What's Next?</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Watch for a shipping confirmation email with tracking details</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Track your order in your account dashboard</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Items will arrive within 5-7 business days</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/orders">View Order Details</Link>
          </Button>
          <Button asChild className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

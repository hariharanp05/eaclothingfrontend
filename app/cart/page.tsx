"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { Trash2, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 100 ? 0 : 10
  const tax = (totalPrice + shippingCost) * 0.08
  const finalTotal = totalPrice + shippingCost + tax

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some items to get started!</p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex gap-4 border border-border rounded-lg p-4"
                >
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-md bg-secondary"
                  />
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold hover:text-accent transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {item.color} - Size {item.size}
                    </p>
                    <p className="font-semibold mt-2">${item.product.price}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 border border-border rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.color, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 hover:bg-secondary"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="p-1 hover:bg-secondary"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 space-y-4 sticky top-20">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-semibold" : ""}>
                    {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <Button
                asChild
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-6 text-base"
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/shop">Continue Shopping</Link>
              </Button>

              {totalPrice <= 100 && (
                <div className="bg-accent/10 border border-accent/20 rounded-md p-3 text-sm">
                  <p className="text-accent font-semibold">
                    Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

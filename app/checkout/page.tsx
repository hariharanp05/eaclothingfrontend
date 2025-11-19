"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCartStore } from "@/lib/store"
import { useAuthStore } from "@/lib/auth-store"
import { ChevronLeft, CreditCard, Lock } from "lucide-react"

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping")
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const { user, isLoggedIn } = useAuthStore()

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
  })

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    setMounted(true)
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const totalPrice = getTotalPrice()
  const shippingCost = totalPrice > 100 ? 0 : 10
  const tax = (totalPrice + shippingCost) * 0.08
  const finalTotal = totalPrice + shippingCost + tax

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(shippingData).some((val) => !val)) {
      alert("Please fill in all shipping fields")
      return
    }
    setStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(paymentData).some((val) => !val)) {
      alert("Please fill in all payment fields")
      return
    }
    setStep("review")
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success
    clearCart()
    router.push("/order-confirmation")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step Indicator */}
          <div className="flex gap-4 mb-8">
            {(["shipping", "payment", "review"] as const).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step === s
                      ? "bg-accent text-accent-foreground"
                      : ["shipping", "payment", "review"].indexOf(step) > idx
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="font-semibold capitalize">{s}</span>
              </div>
            ))}
          </div>

          {/* Shipping Step */}
          {step === "shipping" && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      value={shippingData.firstName}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      value={shippingData.lastName}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={shippingData.email}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    value={shippingData.address}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          state: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) =>
                        setShippingData({
                          ...shippingData,
                          zipCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2"
                >
                  Continue to Payment
                </Button>
              </form>
            </Card>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Payment Information
              </h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardName: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardNumber: e.target.value.replace(/\s/g, "").slice(0, 16),
                        })
                      }
                      placeholder="4532 1234 5678 9010"
                      maxLength={19}
                      className="flex-1 px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          expiryDate: e.target.value,
                        })
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cvv: e.target.value.slice(0, 4),
                        })
                      }
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2"
                  >
                    Review Order
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Review Step */}
          {step === "review" && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="font-semibold">Shipping Address:</span>
                    <span className="text-right text-sm">
                      {shippingData.address}
                      <br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Payment Method:</span>
                    <span className="text-sm">•••• •••• •••• {paymentData.cardNumber.slice(-4)}</span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep("payment")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 border-b border-border pb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x ${item.product.price}
                    </p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-border pb-4 mb-4">
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
              <span className="text-accent">${finalTotal.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

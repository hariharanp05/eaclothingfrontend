"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { ChevronLeft, Lock } from "lucide-react";
import { placeOrder } from "@/lib/api";
import { toast } from "sonner";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "">("");

  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const { user, isLoggedIn } = useAuthStore();

  const [shippingData, setShippingData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
  });

  // 🔹 Only set mounted once
  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 Redirect to /cart ONLY on initial shipping step & empty cart
  useEffect(() => {
    if (!mounted) return;
    if (step === "shipping" && items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, items.length, step, router]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 100 ? 0 : 10;
  const tax = (totalPrice + shippingCost) * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  // STEP 1: Save order + items to DB when shipping is submitted
  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(shippingData).some((val) => !val)) {
      alert("Please fill in all shipping fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    // 🔹 start processing: disable button & show "Processing..."
    setIsProcessing(true);

    try {
      const payload = {
        customer_name: `${shippingData.firstName} ${shippingData.lastName}`,
        email: shippingData.email,
        phone: shippingData.phone, // you can add phone input later
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        pincode: shippingData.zipCode,

        subtotal: totalPrice,
        shipping_cost: shippingCost,
        tax: tax,
        final_total: finalTotal,
        payment_method: "PENDING",

        items: items.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const res = await placeOrder(payload);
      setOrderId(res.order_id);

      toast.success(`Order created! Order ID: ${res.order_id}`);

      // Now move to Payment step (where user picks COD / ONLINE)
      setStep("payment");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      // 🔹 done processing: re-enable buttons for next step
      setIsProcessing(false);
    }
  };

  // STEP 3: Final place order – for now just simulate and redirect
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!orderId) {
      toast.error("Order ID missing. Please go back and try again.");
      setStep("shipping");
      return;
    }

    setIsProcessing(true);

    // Later: if ONLINE, trigger Razorpay using orderId
    await new Promise((resolve) => setTimeout(resolve, 2000));

    clearCart();
    router.push(`/order-confirmation?order=${orderId}`);

    setIsProcessing(false);
  };

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
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={shippingData.phone}
                    onChange={(e) =>
                      setShippingData({
                        ...shippingData,
                        phone: e.target.value,
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
                  disabled={isProcessing}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Continue to Payment"}
                </Button>
              </form>
            </Card>
          )}

          {/* Payment Step – choose COD / Online */}
          {step === "payment" && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                    paymentMethod === "COD"
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent"
                  }`}
                >
                  <div className="font-semibold">Cash on Delivery (COD)</div>
                  <div className="text-xs text-muted-foreground">
                    Pay with cash when your order is delivered.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${
                    paymentMethod === "ONLINE"
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent"
                  }`}
                >
                  <div className="font-semibold">Online Payment</div>
                  <div className="text-xs text-muted-foreground">
                    Pay securely using Razorpay (UPI / Card / Netbanking).
                  </div>
                </button>
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2"
                  onClick={() => {
                    if (!paymentMethod) {
                      toast.error("Please select a payment method");
                      return;
                    }
                    setStep("review");
                  }}
                >
                  Review Order
                </Button>
              </div>
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
                    <span className="text-sm">
                      {paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : paymentMethod === "ONLINE"
                        ? "Online Payment"
                        : "-"}
                    </span>
                  </div>
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="font-semibold">Order ID:</span>
                      <span className="text-sm">#{orderId}</span>
                    </div>
                  )}
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
                <div
                  key={`${item.product.id}-${item.size}-${item.color}`}
                  className="flex justify-between text-sm"
                >
                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}x ₹{item.product.price} &nbsp;
                      {item.color} - Size {item.size}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-border pb-4 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600 font-semibold" : ""}>
                  {shippingCost === 0 ? "Free" : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-accent">₹{finalTotal.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

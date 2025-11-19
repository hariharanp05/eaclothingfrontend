"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, User, MapPin, Phone } from "lucide-react"

export default function AccountPage() {
  const [mounted, setMounted] = useState(false)
  const { user, isLoggedIn, logout, updateProfile } = useAuthStore()
  const router = useRouter()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
  })

  useEffect(() => {
    setMounted(true)
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn, router])

  if (!mounted || !user) {
    return <div className="py-12 text-center">Loading...</div>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <nav className="space-y-2 sticky top-20">
            <button className="w-full text-left px-4 py-2 bg-accent text-accent-foreground rounded-md font-semibold">
              Profile
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="w-full text-left px-4 py-2 hover:bg-secondary rounded-md transition-colors"
            >
              Orders
            </button>
            <button
              onClick={() => router.push("/wishlist")}
              className="w-full text-left px-4 py-2 hover:bg-secondary rounded-md transition-colors"
            >
              Wishlist
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <User className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-semibold">{formData.name || "Not set"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{formData.phone || "Not set"}</p>
                    </div>
                  </div>
                </div>

                {formData.address && (
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-accent mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-semibold">{formData.address}</p>
                      <p className="font-semibold">
                        {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

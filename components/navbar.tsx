"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from "@/lib/store"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const cartCount = getTotalItems()

  const menuItems = [
    { label: "Products", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Purchase History", href: "/orders" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-sm font-bold">
              EA
            </div>
            <span>EA Clothing</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-accent text-accent-foreground text-xs flex items-center justify-center rounded-full font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-md hover:bg-secondary">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/store"
import { useState } from "react"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`} className="block relative overflow-hidden bg-secondary">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.preventDefault()
            setIsWishlisted(!isWishlisted)
          }}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`} className="hover:text-accent transition-colors">
          <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">${product.price}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAddToCart?.(product)}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ProductCard

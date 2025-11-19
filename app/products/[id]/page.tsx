"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import { useCartStore, type CartItem } from "@/lib/store"
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = products.find((p) => p.id === params.id)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "")
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/shop")} variant="outline">
          Back to Shop
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    }
    addItem(cartItem)
    router.push("/cart")
  }

  const images = [product.image, "/product-display-sleek.png", "/product-image-3.png"]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative bg-secondary rounded-lg overflow-hidden aspect-square flex items-center justify-center group">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  idx === currentImageIndex ? "border-accent" : "border-border hover:border-accent"
                }`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-accent mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="text-3xl font-bold text-accent">${product.price}</div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">Color: {selectedColor}</label>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-md border-2 transition-colors ${
                    selectedColor === color ? "border-accent bg-accent/10" : "border-border hover:border-accent"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">Size: {selectedSize}</label>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 rounded-md border-2 transition-colors font-medium ${
                    selectedSize === size
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-6 text-base"
            >
              Add to Cart
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsWishlisted(!isWishlisted)} className="py-6">
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" className="py-6 bg-transparent">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Additional Info */}
          <div className="border-t border-border pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Availability</span>
              <span className="font-semibold text-green-600">In Stock</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold">Free on orders over $100</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Returns</span>
              <span className="font-semibold">30-day return policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

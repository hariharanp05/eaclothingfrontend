"use client"

import { useState } from "react"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"
import { ChevronDown } from "lucide-react"

const collections = [
  {
    id: "all",
    name: "All Products",
    description: "Browse our entire collection",
  },
  {
    id: "mens",
    name: "Men's Collection",
    description: "Premium athletic and casual wear for men",
  },
  {
    id: "womens",
    name: "Women's Collection",
    description: "Stylish and comfortable collection for women",
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with our accessories",
  },
]

export default function CollectionsPage() {
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredProducts =
    selectedCollection === "all" ? products : products.filter((p) => p.category.toLowerCase() === selectedCollection)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-balance">Our Collections</span>
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our carefully curated collections of premium athletic and casual wear.
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold mb-8">Browse Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {collections.map((collection) => (
              <button
                key={collection.id}
                onClick={() => {
                  setSelectedCollection(collection.id)
                  setSortBy("newest")
                }}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedCollection === collection.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                <p className="text-sm text-muted-foreground">{collection.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-muted-foreground">Showing {sortedProducts.length} products</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-lg px-4 py-2 pr-10 text-sm cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4">
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found in this collection.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import ProductCard from "@/components/product-card"
import { ChevronDown } from "lucide-react"
import { fetchProducts } from "@/lib/api"
import type { Product } from "@/lib/store"

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

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Fetch products whenever selectedCollection changes
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchProducts(selectedCollection)
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCollection])

  const activeCollection =
    collections.find((c) => c.id === selectedCollection) ?? collections[0]

  // 🔹 Only sort here (filtering is handled by backend)
  const sortedProducts = useMemo(() => {
    const arr = [...products]
    switch (sortBy) {
      case "price-low":
        return arr.sort((a, b) => a.price - b.price)
      case "price-high":
        return arr.sort((a, b) => b.price - a.price)
      case "name":
        return arr.sort((a, b) => a.name.localeCompare(b.name))
      case "newest":
      default:
        // if you add created_at: sort by that here
        return arr
    }
  }, [products, sortBy])

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
                type="button"
                onClick={() => {
                  setSelectedCollection(collection.id)
                  setSortBy("newest")
                }}
                className={`p-6 rounded-lg border-2 transition-all text-left transform ${
                  selectedCollection === collection.id
                    ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:shadow-sm hover:scale-[1.01]"
                }`}
              >
                <h3 className="font-semibold text-lg mb-2">{collection.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {collection.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="container mx-auto px-4 mb-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{activeCollection.name}</h2>
            <p className="text-sm text-muted-foreground">
              {activeCollection.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {loading ? (
                <p className="text-muted-foreground">Loading products...</p>
              ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Showing{" "}
                  <span className="font-semibold">
                    {sortedProducts.length}
                  </span>{" "}
                  products in{" "}
                  <span className="font-semibold">
                    {activeCollection.name}
                  </span>
                </p>
              )}
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-3">
                No products found in this collection.
              </p>
              <p className="text-sm text-muted-foreground">
                Try{" "}
                <button
                  onClick={() => setSelectedCollection("all")}
                  className="underline underline-offset-4"
                >
                  viewing all products
                </button>{" "}
                or check back soon for new arrivals.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

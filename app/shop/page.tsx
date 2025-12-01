"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCartStore, type CartItem } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/lib/store";

const categories = ["All", "Tops", "Bottoms"];
const sortOptions = [
  { label: "Newest", value: "new" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Most Popular", value: "popular" },
  { label: "Highest Rated", value: "rated" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("new");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  // Fetch products from PHP backend
  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  // Filtering + Sorting with Memo
  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((product) => {
      const categoryMatch = selectedCategory === "All" || product.category === selectedCategory;
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });

    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result = [...result].sort((a, b) => b.reviews - a.reviews);
        break;
      case "rated":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    const cartItem: CartItem = {
      product,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    };
    addItem(cartItem);
    router.push("/cart");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-lg">
        Loading products...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop Our Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="space-y-8 sticky top-20">
            {/* Category Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("new");
                setPriceRange([0, 5000]);
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredAndSortedProducts.length} products
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

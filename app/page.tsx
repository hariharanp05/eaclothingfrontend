import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"

export default function Home() {
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-96 bg-primary flex items-center justify-center text-center text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/fashion-hero-background.jpg" alt="Hero background" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
            Premium Fashion for Modern Living
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90 text-balance">
            Discover our curated collection of high-quality athletic and casual wear.
          </p>
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
          <p className="text-muted-foreground text-lg">Handpicked items from our latest collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 inline-block p-4 bg-primary rounded-full">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">On orders over $100. Fast and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-block p-4 bg-primary rounded-full">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">Premium materials and expert craftsmanship.</p>
            </div>
            <div className="text-center">
              <div className="mb-4 inline-block p-4 bg-primary rounded-full">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-muted-foreground">30-day return policy, no questions asked.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-primary-foreground/90 mb-6">
            Get exclusive offers and be the first to know about new collections.
          </p>
          <form className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md bg-primary-foreground text-primary focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

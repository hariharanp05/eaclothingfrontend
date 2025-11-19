"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Users, Zap, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-balance">About EA Clothing</span>
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            We're passionate about creating premium athletic and casual wear that empowers people to be their best
            selves.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                EA Clothing was founded with a simple mission: to create high-quality, stylish athletic and casual wear
                that makes everyone feel confident. What started as a small passion project has grown into a trusted
                brand loved by thousands of customers worldwide.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that clothing should be more than just fashion—it should inspire movement, confidence, and a
                lifestyle of wellness. Every piece in our collection is carefully designed and tested to ensure it meets
                our high standards of quality and style.
              </p>
            </div>
            <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
              <img
                src="/modern-clothing-store-interior.jpg"
                alt="EA Clothing store"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-0 bg-background">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Quality First</h3>
              <p className="text-muted-foreground text-center">
                We use only the finest materials and rigorous quality control to ensure every piece meets our exacting
                standards.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-background">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Customer Centric</h3>
              <p className="text-muted-foreground text-center">
                Your satisfaction is our priority. We're committed to providing exceptional service and support every
                step of the way.
              </p>
            </Card>

            <Card className="p-6 border-0 bg-background">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">Sustainability</h3>
              <p className="text-muted-foreground text-center">
                We're committed to responsible manufacturing and sustainable practices that minimize our environmental
                impact.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            EA Clothing is built by a passionate team of designers, developers, and logistics experts dedicated to
            bringing you the best in athletic wear.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Sarah Chen", "Marcus Johnson", "Elena Rodriguez"].map((name) => (
              <Card key={name} className="p-6 border-0 bg-muted">
                <div className="w-full h-48 bg-background rounded-lg mb-4 flex items-center justify-center">
                  <img
                    src={`/professional-headshot.png?height=192&width=192&query=professional headshot ${name}`}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold text-lg text-center">{name}</h3>
                <p className="text-muted-foreground text-center text-sm">Co-Founder & Creative Lead</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Become part of the EA Clothing family and get exclusive offers, early access to new collections, and tips on
            living your best life.
          </p>
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Subscribe to Our Newsletter
          </Button>
        </div>
      </section>
    </div>
  )
}

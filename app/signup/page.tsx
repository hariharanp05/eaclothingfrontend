"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuthStore } from "@/lib/auth-store"
import { User, Mail, Lock } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const signup = useAuthStore((state) => state.signup)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields")
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      await signup(formData.email, formData.password, formData.name)
      router.push("/account")
    } catch (err) {
      setError("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join EA Clothing today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-2"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

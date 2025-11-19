"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, ShoppingBag, TrendingUp, Plus, Edit2, Trash2 } from "lucide-react"
import { products } from "@/lib/products"

const stats = [
  { label: "Total Revenue", value: "$24,580", change: "+12.5%", icon: TrendingUp },
  { label: "Total Orders", value: "1,284", change: "+8.2%", icon: ShoppingBag },
  { label: "Total Customers", value: "856", change: "+23.1%", icon: Users },
  { label: "Conversion Rate", value: "3.24%", change: "+1.5%", icon: BarChart3 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers">("overview")
  const [showProductForm, setShowProductForm] = useState(false)

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store and view analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto pb-4">
          {(["overview", "products", "orders", "customers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-accent border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon
                return (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold mb-2">{stat.value}</p>
                        <p className="text-green-600 text-sm font-semibold">{stat.change}</p>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 font-semibold">Order ID</th>
                      <th className="text-left py-3 font-semibold">Customer</th>
                      <th className="text-left py-3 font-semibold">Amount</th>
                      <th className="text-left py-3 font-semibold">Status</th>
                      <th className="text-left py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "ORD-001",
                        customer: "John Doe",
                        amount: "$289.99",
                        status: "Delivered",
                        date: "2024-02-15",
                      },
                      {
                        id: "ORD-002",
                        customer: "Jane Smith",
                        amount: "$159.99",
                        status: "Shipped",
                        date: "2024-02-14",
                      },
                      {
                        id: "ORD-003",
                        customer: "Bob Wilson",
                        amount: "$99.99",
                        status: "Processing",
                        date: "2024-02-13",
                      },
                      {
                        id: "ORD-004",
                        customer: "Alice Brown",
                        amount: "$199.99",
                        status: "Pending",
                        date: "2024-02-12",
                      },
                    ].map((order) => (
                      <tr key={order.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="py-3 font-semibold">{order.id}</td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3 font-semibold">{order.amount}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Products</h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <Card className="p-6 bg-background">
                <h3 className="text-lg font-bold mb-4">Add New Product</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <div className="flex gap-4">
                    <Button type="button" className="bg-accent text-accent-foreground hover:bg-accent/90">
                      Save Product
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowProductForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Products Table */}
            <Card className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 font-semibold">Name</th>
                      <th className="text-left py-3 font-semibold">Category</th>
                      <th className="text-left py-3 font-semibold">Price</th>
                      <th className="text-left py-3 font-semibold">Stock</th>
                      <th className="text-left py-3 font-semibold">Rating</th>
                      <th className="text-left py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-background/50 transition-colors">
                        <td className="py-3 font-semibold">{product.name}</td>
                        <td className="py-3">{product.category}</td>
                        <td className="py-3 font-semibold">${product.price}</td>
                        <td className="py-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            In Stock
                          </span>
                        </td>
                        <td className="py-3 flex items-center gap-1">
                          <span>★</span>
                          <span className="font-semibold">{product.rating}</span>
                        </td>
                        <td className="py-3 flex gap-2">
                          <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">All Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Order ID</th>
                    <th className="text-left py-3 font-semibold">Customer</th>
                    <th className="text-left py-3 font-semibold">Items</th>
                    <th className="text-left py-3 font-semibold">Amount</th>
                    <th className="text-left py-3 font-semibold">Status</th>
                    <th className="text-left py-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "ORD-001",
                      customer: "John Doe",
                      items: 3,
                      amount: "$289.99",
                      status: "Delivered",
                      date: "2024-02-15",
                    },
                    {
                      id: "ORD-002",
                      customer: "Jane Smith",
                      items: 2,
                      amount: "$159.99",
                      status: "Shipped",
                      date: "2024-02-14",
                    },
                    {
                      id: "ORD-003",
                      customer: "Bob Wilson",
                      items: 1,
                      amount: "$99.99",
                      status: "Processing",
                      date: "2024-02-13",
                    },
                    {
                      id: "ORD-004",
                      customer: "Alice Brown",
                      items: 4,
                      amount: "$399.99",
                      status: "Pending",
                      date: "2024-02-12",
                    },
                    {
                      id: "ORD-005",
                      customer: "Charlie Davis",
                      items: 2,
                      amount: "$179.99",
                      status: "Delivered",
                      date: "2024-02-11",
                    },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="py-3 font-semibold">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">{order.items}</td>
                      <td className="py-3 font-semibold">{order.amount}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Name</th>
                    <th className="text-left py-3 font-semibold">Email</th>
                    <th className="text-left py-3 font-semibold">Orders</th>
                    <th className="text-left py-3 font-semibold">Total Spent</th>
                    <th className="text-left py-3 font-semibold">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: 1,
                      name: "John Doe",
                      email: "john@example.com",
                      orders: 5,
                      spent: "$1,289.95",
                      joined: "2023-06-15",
                    },
                    {
                      id: 2,
                      name: "Jane Smith",
                      email: "jane@example.com",
                      orders: 3,
                      spent: "$589.97",
                      joined: "2023-08-22",
                    },
                    {
                      id: 3,
                      name: "Bob Wilson",
                      email: "bob@example.com",
                      orders: 8,
                      spent: "$2,199.92",
                      joined: "2023-04-10",
                    },
                    {
                      id: 4,
                      name: "Alice Brown",
                      email: "alice@example.com",
                      orders: 2,
                      spent: "$399.98",
                      joined: "2024-01-05",
                    },
                    {
                      id: 5,
                      name: "Charlie Davis",
                      email: "charlie@example.com",
                      orders: 6,
                      spent: "$1,799.94",
                      joined: "2023-09-18",
                    },
                  ].map((customer) => (
                    <tr key={customer.id} className="border-b border-border hover:bg-background/50 transition-colors">
                      <td className="py-3 font-semibold">{customer.name}</td>
                      <td className="py-3">{customer.email}</td>
                      <td className="py-3">{customer.orders}</td>
                      <td className="py-3 font-semibold">{customer.spent}</td>
                      <td className="py-3">{customer.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

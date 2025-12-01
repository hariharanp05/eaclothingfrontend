"use client";

import {
  useState,
  useEffect,
  useMemo,
  ChangeEvent,
  FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  X,
} from "lucide-react";
import {
  fetchProducts,
  API_BASE,
  fetchCollections,
  fetchOrders,
  updateOrderStatus,
} from "@/lib/api";
import { useAdminAuthStore } from "@/lib/auth-store";

// Match your DB structure
type Product = {
  id: number;
  name: string;
  price: number;
  original_price?: number | null;
  image?: string | null;
  category?: string | null;
  collection_id?: number | null;
  rating?: number | null;
  reviews?: number | null;
  sizes?: any;
  colors?: any;
  description?: string | null;
  inStock?: any;
};

type Collection = {
  id: number;
  name: string;
  slug?: string;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  size: string;
  color: string;
  quantity: number;
  price: string;
  subtotal: string;
};

type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

type Order = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  final_total: number | string;
  payment_method: string;
  payment_status: string;
  order_status: OrderStatus;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  created_at: string; // timestamp
  items?: OrderItem[];
};

type CustomerSummary = {
  key: string;
  name: string;
  email: string;
  phone: string;
  orderIds: number[];
  ordersCount: number;
  totalSpent: number;
  firstOrderDate: string;
};

/**
 * 🔐 Outer wrapper – protects the admin route
 */
export default function AdminPage() {
  const router = useRouter();
  const isAdmin = useAdminAuthStore((state) => state.isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/login");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-muted-foreground text-sm">
          Redirecting to admin login...
        </p>
      </div>
    );
  }

  return <AdminPageInner />;
}

/**
 * 🧠 Actual admin dashboard UI
 */
function AdminPageInner() {
  const router = useRouter();
  const logout = useAdminAuthStore((state) => state.logout);

  const [activeTab, setActiveTab] =
    useState<"overview" | "products" | "orders" | "customers">("overview");
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Add / Edit product form state
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    original_price: "",
    category: "",
    collection_id: "",
    sizes: "",
    colors: "",
    description: "",
    inStock: true,
  });

  // separate main + gallery images
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // track if editing
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Search states
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  useEffect(() => {
    // products
    fetchProducts().then((data) => {
      if (Array.isArray((data as any).products)) {
        setProducts((data as any).products as Product[]);
      } else if (Array.isArray(data)) {
        setProducts(data as Product[]);
      } else {
        console.error("Unexpected API response:", data);
      }
    });

    // collections for dropdown
    fetchCollections().then((cols) => {
      if (Array.isArray(cols)) {
        setCollections(cols as Collection[]);
      }
    });

    // orders
    fetchOrders()
      .then((data) => {
        if (Array.isArray((data as any).orders)) {
          setOrders((data as any).orders as Order[]);
        } else if (Array.isArray(data)) {
          setOrders(data as Order[]);
        } else {
          console.error("Unexpected orders API response:", data);
        }
      })
      .catch((err) => console.error("Orders fetch error:", err));
  }, []);

  const formatValue = (value: any) => {
    if (!value) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") return value.split(",").join(", ");
    return "-";
  };

  const getCollectionName = (id?: number | null) => {
    if (!id) return "-";
    const col = collections.find((c) => c.id === Number(id));
    return col?.name || String(id);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // -------- Customer summaries (from orders) ----------
  const customerSummaries: CustomerSummary[] = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    for (const order of orders) {
      const key = `${order.email}__${order.phone}`;
      const existing = map.get(key);

      const finalTotal = Number(order.final_total || 0);
      const orderDate = order.created_at ? new Date(order.created_at) : null;

      if (!existing) {
        map.set(key, {
          key,
          name: order.customer_name,
          email: order.email,
          phone: order.phone,
          orderIds: [order.id],
          ordersCount: 1,
          totalSpent: finalTotal,
          firstOrderDate: orderDate ? orderDate.toISOString() : "",
        });
      } else {
        existing.orderIds.push(order.id);
        existing.ordersCount += 1;
        existing.totalSpent += finalTotal;

        if (orderDate) {
          const prev = existing.firstOrderDate
            ? new Date(existing.firstOrderDate)
            : null;
          if (!prev || orderDate < prev) {
            existing.firstOrderDate = orderDate.toISOString();
          }
        }
      }
    }

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [orders]);

  // -------- Customers filters (search only) ----------
  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();

    return customerSummaries.filter((c) => {
      if (!search) return true;

      return (
        c.name.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search) ||
        c.phone.toLowerCase().includes(search)
      );
    });
  }, [customerSummaries, customerSearch]);

  // -------- Products search filter ----------
  const filteredProducts = useMemo(() => {
    const search = productSearch.trim().toLowerCase();
    if (!search) return products;

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const collectionName = getCollectionName(p.collection_id)
        .toString()
        .toLowerCase();
      return (
        name.includes(search) ||
        category.includes(search) ||
        collectionName.includes(search)
      );
    });
  }, [products, productSearch]);

  // -------- Orders search filter ----------
  const filteredOrders = useMemo(() => {
    const search = orderSearch.trim().toLowerCase();
    if (!search) return orders;

    return orders.filter((o) => {
      const idStr = String(o.id);
      const customer = (o.customer_name || "").toLowerCase();
      const email = (o.email || "").toLowerCase();
      const phone = (o.phone || "").toLowerCase();
      const city = (o.city || "").toLowerCase();
      const state = (o.state || "").toLowerCase();
      const pincode = (o.pincode || "").toLowerCase();

      const itemsText = (o.items || [])
        .map((it) => it.product_name || "")
        .join(" ")
        .toLowerCase();

      return (
        idStr.includes(search) ||
        customer.includes(search) ||
        email.includes(search) ||
        phone.includes(search) ||
        city.includes(search) ||
        state.includes(search) ||
        pincode.includes(search) ||
        itemsText.includes(search)
      );
    });
  }, [orders, orderSearch]);

  // -------- Real-time dashboard stats ----------
  const dashboardStats = useMemo(() => {
    const totalOrders = orders.length;

    // revenue only from delivered / paid orders
    const revenueOrders = orders.filter(
      (o) => o.order_status === "delivered" || o.payment_status === "paid"
    );

    const totalRevenue = revenueOrders.reduce((sum, o) => {
      return sum + Number(o.final_total || 0);
    }, 0);

    const totalCustomers = customerSummaries.length;

    const deliveredOrders = orders.filter(
      (o) => o.order_status === "delivered"
    ).length;

    const conversionRate =
      totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

    return [
      {
        label: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString("en-IN")}`,
        sub: "Delivered / Paid orders",
        icon: TrendingUp,
      },
      {
        label: "Total Orders",
        value: totalOrders.toString(),
        sub: `${deliveredOrders} delivered`,
        icon: ShoppingBag,
      },
      {
        label: "Total Customers",
        value: totalCustomers.toString(),
        sub: "Unique by email + phone",
        icon: Users,
      },
      {
        label: "Conversion Rate",
        value: `${conversionRate.toFixed(1)}%`,
        sub: "Delivered / All orders",
        icon: BarChart3,
      },
    ];
  }, [orders, customerSummaries]);

  // text / textarea / select / checkbox change
  const handleInputChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;

    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // MAIN image change
  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImage(file);
  };

  // GALLERY images change (multiple)
  const handleGalleryImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGalleryImages(e.target.files);
  };

  // Click EDIT → fill form
  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name || "",
      price: product.price != null ? String(product.price) : "",
      original_price:
        product.original_price != null ? String(product.original_price) : "",
      category: product.category || "",
      collection_id:
        product.collection_id != null ? String(product.collection_id) : "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(",")
        : product.sizes || "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(",")
        : product.colors || "",
      description: product.description || "",
      inStock: Number(product.inStock) === 1,
    });

    setMainImage(null);
    setGalleryImages(null);
    setFormMessage(null);
    setEditingProductId(product.id);
    setShowProductForm(true);
  };

  // submit add / edit product form
  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    if (!productForm.name || !productForm.price) {
      setFormMessage("Name and price are required.");
      return;
    }

    if (!productForm.category) {
      setFormMessage("Please select a category (Tops / Bottoms).");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("price", productForm.price);
      formData.append("original_price", productForm.original_price);
      formData.append("category", productForm.category);
      formData.append("collection_id", productForm.collection_id);
      formData.append("sizes", productForm.sizes);
      formData.append("colors", productForm.colors);
      formData.append("description", productForm.description);
      formData.append("inStock", productForm.inStock ? "1" : "0");

      // if editing, send id
      if (editingProductId !== null) {
        formData.append("id", String(editingProductId));
      }

      // send main_image (optional)
      if (mainImage) {
        formData.append("main_image", mainImage);
      }

      // send gallery_images[] (optional)
      if (galleryImages && galleryImages.length > 0) {
        Array.from(galleryImages).forEach((file) => {
          formData.append("gallery_images[]", file);
        });
      }

      // choose endpoint
      const endpoint =
        editingProductId !== null
          ? `${API_BASE}/admin_update_product.php`
          : `${API_BASE}/admin_add_product.php`;

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setFormMessage(
          editingProductId
            ? "✅ Product updated successfully."
            : "✅ Product added successfully."
        );

        // reset form
        setProductForm({
          name: "",
          price: "",
          original_price: "",
          category: "",
          collection_id: "",
          sizes: "",
          colors: "",
          description: "",
          inStock: true,
        });
        setMainImage(null);
        setGalleryImages(null);
        setShowProductForm(false);
        setEditingProductId(null);

        // refresh products list
        fetchProducts().then((data) => {
          if (Array.isArray((data as any).products)) {
            setProducts((data as any).products as Product[]);
          } else if (Array.isArray(data)) {
            setProducts(data as Product[]);
          }
        });
      } else {
        setFormMessage(data.message || "❌ Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      setFormMessage("❌ Error while saving product.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(id);

      const formData = new FormData();
      formData.append("id", String(id));

      const res = await fetch(`${API_BASE}/admin_delete_product.php`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  };

  // change order status
  const handleOrderStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrderId(orderId);
      const res = await updateOrderStatus(orderId, newStatus);
      if (res.status === "success") {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, order_status: newStatus } : o
          )
        );
      } else {
        alert(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Order status update error:", err);
      alert("Error updating order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Download customers as CSV (Excel-friendly)
  const handleDownloadCustomers = () => {
    if (filteredCustomers.length === 0) {
      alert("No customers to download.");
      return;
    }

    const header = [
      "Name",
      "Email",
      "Phone",
      "Order IDs",
      "No. of Orders",
      "Total Spent",
      "First Order Date",
    ];

    const rows = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.phone,
      c.orderIds.map((id) => `#${id}`).join(" | "),
      String(c.ordersCount),
      c.totalSpent.toString(),
      c.firstOrderDate
        ? new Date(c.firstOrderDate).toLocaleString()
        : "",
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((val) => {
            const safe = (val ?? "").toString().replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "customers.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Logout */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your store and view analytics
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-sm"
          >
            Logout
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto pb-4">
          {(["overview", "products", "orders", "customers"] as const).map(
            (tab) => (
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
            )
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid – REAL TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={idx} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold mb-1">
                          {stat.value}
                        </p>
                        {stat.sub && (
                          <p className="text-xs text-muted-foreground">
                            {stat.sub}
                          </p>
                        )}
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <IconComponent className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold">
                {editingProductId ? "Edit Product" : "Manage Products"}
              </h2>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Search products (name / category / collection)"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <Button
                  onClick={() => {
                    setProductForm({
                      name: "",
                      price: "",
                      original_price: "",
                      category: "",
                      collection_id: "",
                      sizes: "",
                      colors: "",
                      description: "",
                      inStock: true,
                    });
                    setMainImage(null);
                    setGalleryImages(null);
                    setEditingProductId(null);
                    setShowProductForm(true);
                  }}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {editingProductId ? "New Product" : "Add Product"}
                </Button>
              </div>
            </div>

            {showProductForm && (
              <Card className="p-6 bg-background relative">
                {/* Close button (X) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProductId(null);
                  }}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <h3 className="text-lg font-bold mb-4 pr-8">
                  {editingProductId ? "Edit Product" : "Add New Product"}
                </h3>
                <form
                  className="space-y-4"
                  onSubmit={handleProductSubmit}
                  encType="multipart/form-data"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.name}
                      onChange={handleInputChange}
                      required
                    />

                    {/* Category dropdown – only Tops & Bottoms */}
                    <select
                      name="category"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                    </select>

                    <input
                      type="number"
                      name="price"
                      placeholder="Offered Price"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.price}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="original_price"
                      placeholder="Original Price (MRP)"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.original_price}
                      onChange={handleInputChange}
                    />

                    {/* Collection dropdown */}
                    <select
                      name="collection_id"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.collection_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Collection</option>
                      {collections.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.name}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      name="sizes"
                      placeholder="Sizes (e.g. XS,S,M,L,XL)"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.sizes}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="colors"
                      placeholder="Colors (e.g. Black,White,Blue)"
                      className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      value={productForm.colors}
                      onChange={handleInputChange}
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={productForm.inStock}
                        onChange={handleInputChange}
                      />
                      In Stock
                    </label>
                  </div>

                  <textarea
                    name="description"
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    value={productForm.description}
                    onChange={handleInputChange}
                  />

                  {/* MAIN image input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Main Image (thumbnail)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {editingProductId && (
                      <p className="text-xs text-muted-foreground">
                        Leave empty to keep existing main image.
                      </p>
                    )}
                  </div>

                  {/* GALLERY images input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">
                      Other Images (gallery)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryImagesChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {editingProductId && (
                      <p className="text-xs text-muted-foreground">
                        If you upload new gallery images, old ones will be
                        replaced.
                      </p>
                    )}
                  </div>

                  {formMessage && (
                    <p className="text-sm text-muted-foreground">
                      {formMessage}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      disabled={saving}
                    >
                      {saving
                        ? editingProductId
                          ? "Updating..."
                          : "Saving..."
                        : editingProductId
                        ? "Update Product"
                        : "Save Product"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowProductForm(false);
                        setEditingProductId(null);
                      }}
                    >
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
                      <th className="text-left py-3 font-semibold">Image</th>
                      <th className="text-left py-3 font-semibold">
                        Category
                      </th>
                      <th className="text-left py-3 font-semibold">Price</th>
                      <th className="text-left py-3 font-semibold">Stock</th>
                      <th className="text-left py-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const isInStock = Number(product.inStock) === 1;

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-border hover:bg-background/50 transition-colors"
                        >
                          {/* Name + Collection */}
                          <td className="py-3 font-semibold">
                            {product.name}
                            <div className="text-xs text-muted-foreground">
                              Collection:{" "}
                              {getCollectionName(product.collection_id)}
                            </div>
                          </td>

                          {/* Small image thumbnail */}
                          <td className="py-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 rounded-md object-cover border border-border"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-md border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </td>

                          {/* Category + sizes/colors */}
                          <td className="py-3">
                            <div>{product.category ?? "-"}</div>
                            <div className="text-xs text-muted-foreground">
                              Sizes: {formatValue(product.sizes)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Colors: {formatValue(product.colors)}
                            </div>
                          </td>

                          {/* Price + original price */}
                          <td className="py-3 font-semibold">
                            ₹{product.price}
                            {product.original_price &&
                              Number(product.original_price) >
                                Number(product.price) && (
                                <div className="text-xs text-muted-foreground line-through">
                                  MRP: ₹{product.original_price}
                                </div>
                              )}
                          </td>

                          {/* Stock */}
                          <td className="py-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isInStock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isInStock ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-accent hover:bg-accent/10"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={deletingId === product.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-6 text-center text-muted-foreground"
                        >
                          No products match the search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Orders Tab – REAL DATA + ACTION column */}
        {activeTab === "orders" && (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">All Orders</h2>
              <input
                type="text"
                placeholder="Search orders (id / name / email / phone / product)"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
            </div>

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
                    <th className="text-left py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border hover:bg-background/50 transition-colors"
                    >
                      {/* 1. Order ID */}
                      <td className="py-3 font-semibold whitespace-nowrap">
                        #{order.id}
                      </td>

                      {/* 2. Customer + Full Address */}
                      <td className="py-3">
                        <div className="font-semibold text-base">
                          {order.customer_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Phone: {order.phone}
                        </div>

                        {/* Address */}
                        <div className="mt-1 text-xs leading-snug text-muted-foreground">
                          {order.address}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.city}, {order.state} – {order.pincode}
                        </div>
                      </td>

                      {/* 3. Items with size + color + qty */}
                      <td className="py-3 text-xs">
                        {order.items && order.items.length > 0 ? (
                          <ul className="space-y-1">
                            {order.items.map((item: any) => (
                              <li key={item.id}>
                                <span className="font-semibold">
                                  {item.product_name}
                                </span>{" "}
                                – Size: {item.size || "-"}, Color:{" "}
                                {item.color || "-"}, Qty: {item.quantity}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-muted-foreground">
                            No items
                          </span>
                        )}
                      </td>

                      {/* 4. Amount */}
                      <td className="py-3 font-semibold whitespace-nowrap">
                        ₹
                        {Number(order.final_total || 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* 5. Status badge */}
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                            order.order_status
                          )}`}
                        >
                          {order.order_status}
                        </span>
                      </td>

                      {/* 6. Date from created_at */}
                      <td className="py-3 whitespace-nowrap">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "-"}
                      </td>

                      {/* 7. Action → change status */}
                      <td className="py-3">
                        <select
                          value={order.order_status}
                          disabled={updatingOrderId === order.id}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className="px-2 py-1 border border-border rounded-md bg-background text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No orders match the search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Customers Tab – from orders + search filter + download */}
        {activeTab === "customers" && (
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Customer Management</h2>

              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Search name / email / phone"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm"
                  onClick={handleDownloadCustomers}
                >
                  Download Excel (CSV)
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 font-semibold">Name</th>
                    <th className="text-left py-3 font-semibold">Email</th>
                    <th className="text-left py-3 font-semibold">Phone</th>
                    <th className="text-left py-3 font-semibold">Order IDs</th>
                    <th className="text-left py-3 font-semibold">
                      No. of Orders
                    </th>
                    <th className="text-left py-3 font-semibold">
                      Total Spent
                    </th>
                    <th className="text-left py-3 font-semibold">
                      First Order Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr
                      key={c.key}
                      className="border-b border-border hover:bg-background/50 transition-colors"
                    >
                      <td className="py-3 font-semibold">{c.name}</td>
                      <td className="py-3">{c.email}</td>
                      <td className="py-3 whitespace-nowrap">{c.phone}</td>
                      <td className="py-3">
                        {c.orderIds.map((id) => `#${id}`).join(", ")}
                      </td>
                      <td className="py-3">{c.ordersCount}</td>
                      <td className="py-3 font-semibold">
                        ₹{c.totalSpent.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        {c.firstOrderDate
                          ? new Date(c.firstOrderDate).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-6 text-center text-muted-foreground"
                      >
                        No customers match the filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

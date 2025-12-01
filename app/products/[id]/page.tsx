"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchProduct } from "@/lib/api";
import { useCartStore, type CartItem } from "@/lib/store";
import { Heart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  // unwrap params (Next.js 16 requirement)
  const { id } = use(params);

  // state for product data from backend
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addItem = useCartStore((state) => state.addItem);

  // Fetch product from backend
  useEffect(() => {
    fetchProduct(id)
      .then((data) => {
        setProduct(data);

        // Normalize sizes/colors for initial selection
        const sizesArray = Array.isArray(data?.sizes)
          ? data.sizes
          : typeof data?.sizes === "string"
          ? data.sizes
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [];

        const colorsArray = Array.isArray(data?.colors)
          ? data.colors
          : typeof data?.colors === "string"
          ? data.colors
              .split(",")
              .map((c: string) => c.trim())
              .filter(Boolean)
          : [];

        setSelectedSize(sizesArray[0] || "");
        setSelectedColor(colorsArray[0] || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-lg font-semibold">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/shop")} variant="outline">
          Back to Shop
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    };
    addItem(cartItem);
    toast.success("🛒 Added to cart!");
    // router.push("/cart");
  };

  // 🔥 Normalize backend images (main + gallery)
  let galleryFromApi: string[] = [];

  if (Array.isArray(product.images)) {
    galleryFromApi = product.images;
  } else if (typeof product.images === "string") {
    // in case backend sends "img1.jpg,img2.jpg"
    galleryFromApi = product.images
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  // main image first, then gallery (no duplicates), all truthy
  const images: string[] = [
    product.image,
    ...galleryFromApi.filter(
      (img) => img && img !== product.image
    ),
  ].filter(Boolean);

  // Normalize sizes/colors for rendering (in case API sends string)
  const sizesArray: string[] = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === "string"
    ? product.sizes
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : [];

  const colorsArray: string[] = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === "string"
    ? product.colors
        .split(",")
        .map((c: string) => c.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
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
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + images.length) % images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % images.length
                    )
                  }
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
                  idx === currentImageIndex
                    ? "border-accent"
                    : "border-border hover:border-accent"
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
            <p className="text-sm font-medium text-accent mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
          </div>

          <div className="text-3xl font-bold text-accent">
            <span className="line-through text-muted-foreground mr-3">
              {product.original_price
                ? `₹${product.original_price.toLocaleString("en-IN")}`
                : null}
            </span>
            <span>₹{product.price.toLocaleString("en-IN")}</span>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Color: {selectedColor}
            </label>
            <div className="flex gap-3">
              {colorsArray.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-md border-2 transition-colors ${
                    selectedColor === color
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Size: {selectedSize}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizesArray.map((size) => (
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
            <label className="block text-sm font-semibold mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-6 text-base"
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="py-6"
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="py-6 bg-transparent"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

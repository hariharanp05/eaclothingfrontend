// src/lib/api.ts

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost/ecomdressapi";

// -----------------------
// GET ALL PRODUCTS  (now supports optional collection)
// -----------------------
export async function fetchProducts(collection?: string) {
  try {
    const query =
      collection && collection !== "all"
        ? `?collection=${encodeURIComponent(collection)}`
        : "";

    const response = await fetch(`${API_BASE}/get_products.php${query}`, {
      method: "GET",
      cache: "no-store", // always get fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (error) {
    console.error("fetchProducts Error:", error);
    return [];
  }
}

// -----------------------
// GET SINGLE PRODUCT
// -----------------------
export async function fetchProduct(id: string | number) {
  try {
    const response = await fetch(`${API_BASE}/get_product.php?id=${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    return response.json();
  } catch (error) {
    console.error("fetchProduct Error:", error);
    return null;
  }
}

// -----------------------
// ADD TO CART (future example)
// -----------------------
// export async function addToCart(data: any) {
//   try {
//     const response = await fetch(`${API_BASE}/add_to_cart.php`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });

//     return response.json();
//   } catch (error) {
//     console.error("addToCart Error:", error);
//     return null;
//   }
// }

export async function placeOrder(payload: any) {
  const response = await fetch(`${API_BASE}/place_order.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }

  return response.json();
}


export async function fetchCollections() {
  try {
    const response = await fetch(`${API_BASE}/get_collections.php`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch collections");
    }

    return response.json();
  } catch (error) {
    console.error("fetchCollections Error:", error);
    return [];
  }
}


export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/admin_get_orders.php`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(id: number, order_status: string) {
  const formData = new FormData();
  formData.append("id", String(id));
  formData.append("order_status", order_status);

  const res = await fetch(`${API_BASE}/admin_update_order_status.php`, {
    method: "POST",
    body: formData,
  });

  return res.json();
}

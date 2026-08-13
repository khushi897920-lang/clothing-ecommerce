// Unified API Client for YUGEN Backend Microservices API Gateway

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("yugen_token") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("yugen_token");
        localStorage.removeItem("yugen_user");
        window.dispatchEvent(new Event("yugen-auth-expired"));
        const redirectPath = window.location.pathname + window.location.search;
        if (!window.location.pathname.startsWith("/signin") && !window.location.pathname.startsWith("/signup")) {
          window.location.href = `/signin?redirect=${encodeURIComponent(redirectPath)}`;
        }
      }
      return { data: null, error: "Unauthorized" };
    }

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.error || data.message || `HTTP ${response.status} Error` };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Network error. Server unreachable." };
  }
}

// Product APIs
export const productApi = {
  getCatalog: (params?: Record<string, string | number>) => {
    const queryString = params ? "?" + new URLSearchParams(params as any).toString() : "";
    return fetchApi(`/products${queryString}`);
  },
  getProductBySlug: (slug: string) => fetchApi(`/products/${slug}`),
  getCategories: () => fetchApi(`/products/categories/list`),
  getAdminProducts: () => fetchApi(`/products/admin/all`),
  createProduct: (productData: any) =>
    fetchApi(`/products/admin/products`, { method: "POST", body: JSON.stringify(productData) }),
  updateProduct: (id: string, productData: any) =>
    fetchApi(`/products/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(productData) }),
  deleteProduct: (id: string) =>
    fetchApi(`/products/admin/products/${id}`, { method: "DELETE" }),
  createCategory: (categoryData: any) =>
    fetchApi(`/products/admin/categories`, { method: "POST", body: JSON.stringify(categoryData) }),
  updateCategory: (id: string, categoryData: any) =>
    fetchApi(`/products/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify(categoryData) }),
  deleteCategory: (id: string) =>
    fetchApi(`/products/admin/categories/${id}`, { method: "DELETE" }),
};

// Auth APIs
export const authApi = {
  signIn: (credentials: { email: string; password: string }) =>
    fetchApi(`/auth/login`, { method: "POST", body: JSON.stringify(credentials) }),
  signUp: (userData: { firstName: string; lastName?: string; email: string; password: string }) =>
    fetchApi(`/auth/register`, { method: "POST", body: JSON.stringify(userData) }),
  refreshToken: () => fetchApi(`/auth/refresh`, { method: "POST" }),
  logout: () => fetchApi(`/auth/logout`, { method: "POST" }),
  getMe: () => fetchApi(`/auth/me`),
  getProfile: () => fetchApi(`/users/me`),
  updateProfile: (profileData: { firstName?: string; lastName?: string; phone?: string }) =>
    fetchApi(`/users/me`, { method: "PATCH", body: JSON.stringify(profileData) }),
};

// User, Address & Wishlist APIs
export const userApi = {
  getAddresses: () => fetchApi(`/users/addresses`),
  addAddress: (addressData: any) =>
    fetchApi(`/users/addresses`, { method: "POST", body: JSON.stringify(addressData) }),
  updateAddress: (id: string, addressData: any) =>
    fetchApi(`/users/addresses/${id}`, { method: "PUT", body: JSON.stringify(addressData) }),
  deleteAddress: (id: string) =>
    fetchApi(`/users/addresses/${id}`, { method: "DELETE" }),
  getWishlist: () => fetchApi(`/users/wishlist`),
  addToWishlist: (productId: string) =>
    fetchApi(`/users/wishlist`, { method: "POST", body: JSON.stringify({ productId }) }),
  removeFromWishlist: (productId: string) =>
    fetchApi(`/users/wishlist/${productId}`, { method: "DELETE" }),
  getAdminCustomers: () => fetchApi(`/users/admin/customers`),
  toggleCustomerStatus: (id: string, isActive: boolean) =>
    fetchApi(`/users/admin/customers/${id}/status`, { method: "PUT", body: JSON.stringify({ isActive }) }),
};

// Cart APIs
export const cartApi = {
  getCart: () => fetchApi(`/cart`),
  addToCart: (itemData: { variantId: string; quantity: number }) =>
    fetchApi(`/cart/items`, { method: "POST", body: JSON.stringify(itemData) }),
  updateCartItem: (itemId: string, quantity: number) =>
    fetchApi(`/cart/items/${itemId}`, { method: "PATCH", body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: string) =>
    fetchApi(`/cart/items/${itemId}`, { method: "DELETE" }),
  clearCart: () => fetchApi(`/cart`, { method: "DELETE" }),
};

// Order APIs
export const orderApi = {
  createOrder: (orderPayload: { shippingAddressId?: string; shippingAddress?: any; items?: any[] }) =>
    fetchApi(`/orders`, { method: "POST", body: JSON.stringify(orderPayload) }),
  getMyOrders: () => fetchApi(`/orders/me`),
  getTracking: (orderId: string) => fetchApi(`/orders/track/${orderId}`),
  cancelOrder: (orderId: string) => fetchApi(`/orders/${orderId}/cancel`, { method: "POST" }),
  getAdminOrders: () => fetchApi(`/orders/admin/all`),
  updateOrderStatus: (orderId: string, status: string) =>
    fetchApi(`/orders/admin/orders/${orderId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  getAdminAnalytics: () => fetchApi(`/orders/admin/analytics`),
};

// Payment APIs
export const paymentApi = {
  createPaymentIntent: (amount: number, orderId?: string) =>
    fetchApi(`/payments/create-intent`, { method: "POST", body: JSON.stringify({ amount, orderId }) }),
  getAdminPayments: () => fetchApi(`/payments/admin/all`),
  refundPayment: (paymentId: string, reason?: string) =>
    fetchApi(`/payments/admin/refund`, { method: "POST", body: JSON.stringify({ paymentId, reason }) }),
};

// Inventory APIs
export const inventoryApi = {
  checkStock: (productId: string) => fetchApi(`/inventory/check/${productId}`),
  reserveStock: (items: any[]) => fetchApi(`/inventory/reserve`, { method: "POST", body: JSON.stringify({ items }) }),
  getAdminStock: () => fetchApi(`/inventory/admin/stock`),
  updateAdminStock: (variantId: string, stockQuantity: number) =>
    fetchApi(`/inventory/admin/stock/${variantId}`, { method: "PUT", body: JSON.stringify({ stockQuantity }) }),
};

// Notification APIs
export const notificationApi = {
  getNotifications: () => fetchApi(`/notifications`),
  markAsRead: (id: string) => fetchApi(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllAsRead: () => fetchApi(`/notifications/read-all`, { method: "PATCH" }),
};

// Helper: Build absolute image URL from backend imageUrl field
// DB stores: "images/M-ACTI-0001.jpg"  →  Frontend needs: "/dataset/images/M-ACTI-0001.jpg"
function resolveImageUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return "/ABOUT_BG.png";
  // Already an absolute URL (http/https) → use as-is
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) return rawUrl;
  // Already starts with / → use as-is
  if (rawUrl.startsWith("/")) return rawUrl;
  // Relative path like "images/xxx.jpg" → prefix with /dataset/
  if (rawUrl.startsWith("images/")) return `/dataset/${rawUrl}`;
  // Anything else → best effort
  return `/${rawUrl}`;
}

// Known color name → hex map for swatches derived from variant colors
const COLOR_HEX_MAP: Record<string, string> = {
  black: "#1A1A1A",
  white: "#F5F5F5",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  navy: "#1B2A4A",
  blue: "#2C5F8A",
  red: "#C0392B",
  green: "#2E7D32",
  olive: "#6B6B35",
  khaki: "#C8B560",
  beige: "#E3D7C5",
  cream: "#F5F0E8",
  brown: "#795548",
  tan: "#C4A882",
  maroon: "#800000",
  burgundy: "#800020",
  pink: "#E91E8C",
  lavender: "#9C6ADE",
  purple: "#6A1B9A",
  yellow: "#F9A825",
  orange: "#E65100",
  teal: "#00695C",
  camel: "#C19A6B",
  charcoal: "#36454F",
  rust: "#8B3A2C",
  sage: "#87A878",
  peach: "#FFCBA4",
  mint: "#98FF98",
  coral: "#FF6B6B",
  indigo: "#3F51B5",

  // Additional compound and specific database colors
  "mustard": "#E1AD01",
  "mustard yellow": "#E1AD01",
  "butter yellow": "#FFF3CC",
  "butter-yellow": "#FFF3CC",
  "butteryellow": "#FFF3CC",
  "lemon yellow": "#FFF44F",
  "lilac": "#C8A2C8",
  "wine": "#722F37",
  "ivory": "#FFFFF0",
  "off white": "#FAF0E6",
  "sky blue": "#87CEEB",
  "baby blue": "#89CFF0",
  "royal blue": "#4169E1",
  "powder blue": "#B0E0E6",
  "forest green": "#228B22",
  "sage green": "#87A878",
  "dusty rose": "#DCAE96",
  "taupe": "#483C32",
  "coffee": "#6F4E37",
  "cocoa": "#5C4033",
  "cocoa brown": "#5C4033",
};

export function colorNameToHex(colorName: string): string {
  if (!colorName) return "#888888";
  
  // Normalize string: lowercase, trim, replace hyphens/underscores/spaces with single space
  const clean = colorName.toLowerCase().replace(/[-_]/g, " ").trim();
  
  // 1. Direct match on clean name
  if (COLOR_HEX_MAP[clean]) return COLOR_HEX_MAP[clean];
  
  // 2. Check if it already starts with '#' (is a hex code)
  if (/^#[0-9a-f]{3,6}$/i.test(clean)) return clean;
  
  // 3. Synonym / compound variations without spaces (e.g. "ButterYellow" / "cocoabrown")
  const compact = clean.replace(/\s+/g, "");
  if (COLOR_HEX_MAP[compact]) return COLOR_HEX_MAP[compact];
  
  // 4. Fallback search for partial words (e.g. "yellow" in "butter yellow")
  const words = clean.split(/\s+/);
  for (const word of words) {
    if (COLOR_HEX_MAP[word]) return COLOR_HEX_MAP[word];
  }
  
  // Check sub-string matching (longer keys first to match "sage green" before "green")
  const sortedKeys = Object.keys(COLOR_HEX_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (clean.includes(key)) return COLOR_HEX_MAP[key];
  }
  
  // 5. If still unknown, log in dev environment and return a neutral gray (never red)
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[colorNormalizer] Unknown color name: "${colorName}" (normalized: "${clean}")`);
  }
  return "#7F8C8D";
}


// Helper: Transform Backend Product to Standard Frontend Product Shape
export function mapBackendProduct(p: any) {
  if (!p) return null;

  // ── IMAGES ──
  // Backend returns either:
  //   images: { id, imageUrl, publicId, isPrimary, ... }  (single object)
  //   images: null
  //   images: [...]  (in some category responses)
  let imagesArr: any[] = [];
  if (Array.isArray(p.images)) {
    imagesArr = p.images;
  } else if (p.images && typeof p.images === "object") {
    imagesArr = [p.images];
  }
  const primaryImg = imagesArr.find((img: any) => img?.isPrimary) || imagesArr[0] || null;
  const rawImgUrl = primaryImg?.imageUrl || primaryImg?.url || p.imageUrl || p.image || null;
  const resolvedImageUrl = resolveImageUrl(rawImgUrl);

  // All image URLs for gallery
  const allImages: string[] = imagesArr
    .map((img: any) => resolveImageUrl(img?.imageUrl || img?.url))
    .filter((url) => url !== "/ABOUT_BG.png");

  // ── PRICE ──
  const priceNum = parseFloat(p.price || p.priceNum || "0");
  const discountPriceNum = p.discountPrice ? parseFloat(p.discountPrice) : null;
  const origPriceNum = discountPriceNum || Math.round(priceNum * 1.25);
  const formattedPrice = `₹${priceNum.toFixed(0)}`;

  // ── VARIANTS ──
  const variants: any[] = Array.isArray(p.variants) ? p.variants : [];

  // ── SIZES from variants ──
  const sizes: string[] = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[];

  // ── COLORS from variants (unique, preserving insertion order) ──
  const colorsArr: string[] = Array.from(new Set(variants.map((v: any) => v.color).filter(Boolean))) as string[];

  // ── SWATCHES (hex codes derived from variant color names) ──
  const swatches: string[] = colorsArr.map(colorNameToHex);

  // ── STOCK ──
  const availableStock = variants.reduce(
    (acc: number, v: any) => acc + Math.max(0, (v.availableStock ?? v.stockQuantity ?? 0) - (v.reservedQuantity ?? 0)),
    0
  );

  // ── CATEGORY ──
  // category can be: { id, name, slug } or a string or null
  const categoryName = typeof p.category === "string"
    ? p.category
    : p.category?.name || "Clothing";
  const categorySlug = p.category?.slug || null;

  return {
    id: p.id,
    name: p.name || "Unnamed Product",
    title: p.name || "Unnamed Product",
    slug: p.slug || p.id,
    description: p.description || "",
    category: categoryName,
    categorySlug,
    gender: p.audience === "MEN" ? "Men" : p.audience === "WOMEN" ? "Women" : "Unisex",
    audience: p.audience,
    // Pricing
    price: formattedPrice,
    formattedPrice,
    priceNum,
    originalPrice: `₹${origPriceNum.toFixed(0)}`,
    // Images
    imageUrl: resolvedImageUrl,
    image: resolvedImageUrl,
    images: allImages.length > 0 ? allImages : [resolvedImageUrl],
    primaryImage: resolvedImageUrl,
    // Variants & selectors
    variants,
    sizes,
    colors: colorsArr,
    swatches,
    color: colorsArr[0] || "",
    // Stock & status
    availableStock,
    inStock: availableStock > 0,
    stockQuantity: availableStock,
    isActive: p.isActive,
    // Dates
    createdAt: p.createdAt,
  };
}

// Helper: Transform Backend Cart Item to Standard Canonical Frontend Shape
export function mapBackendCartItem(item: any) {
  if (!item) return null;

  // Real backend fields
  const unitPrice = parseFloat(item.unitPrice || "0");
  const lineTotal = parseFloat(item.lineTotal || (unitPrice * (item.quantity || 1)).toString());
  
  // Resolve image using the shared helper
  const rawImgUrl = item.imageUrl || item.product?.imageUrl || null;
  const resolvedImageUrl = resolveImageUrl(rawImgUrl);

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    productName: item.productName || item.product?.name || "Apparel Item",
    slug: item.slug || item.product?.slug || "product",
    imageUrl: resolvedImageUrl,
    unitPrice,
    size: item.size || "M",
    color: item.color || "Default",
    quantity: item.quantity || 1,
    lineTotal,
    availableStock: item.availableStock ?? 50,
  };
}


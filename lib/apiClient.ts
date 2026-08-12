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

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.error || `HTTP ${response.status} Error` };
    }

    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Network error. Server unreachable." };
  }
}

// Product APIs
export const productApi = {
  getCatalog: (params?: Record<string, string>) => {
    const queryString = params ? "?" + new URLSearchParams(params).toString() : "";
    return fetchApi(`/products${queryString}`);
  },
  getProductBySlug: (slug: string) => fetchApi(`/products/${slug}`),
  getCategories: () => fetchApi(`/products/categories/list`),
  getAdminProducts: () => fetchApi(`/products/admin/all`),
};

// Auth APIs
export const authApi = {
  signIn: (credentials: { email: string; password: string }) =>
    fetchApi(`/auth/signin`, { method: "POST", body: JSON.stringify(credentials) }),
  signUp: (userData: { firstName: string; lastName?: string; email: string; password: string }) =>
    fetchApi(`/auth/signup`, { method: "POST", body: JSON.stringify(userData) }),
  getProfile: () => fetchApi(`/auth/me`),
};

// User & Address APIs
export const userApi = {
  getAddresses: () => fetchApi(`/users/addresses`),
  addAddress: (addressData: any) =>
    fetchApi(`/users/addresses`, { method: "POST", body: JSON.stringify(addressData) }),
  updateAddress: (id: string, addressData: any) =>
    fetchApi(`/users/addresses/${id}`, { method: "PUT", body: JSON.stringify(addressData) }),
  deleteAddress: (id: string) =>
    fetchApi(`/users/addresses/${id}`, { method: "DELETE" }),
  getAdminCustomers: () => fetchApi(`/users/admin/customers`),
  toggleCustomerStatus: (id: string, isActive: boolean) =>
    fetchApi(`/users/admin/customers/${id}/status`, { method: "PUT", body: JSON.stringify({ isActive }) }),
};

// Order & Payment APIs
export const orderApi = {
  createOrder: (orderPayload: any) =>
    fetchApi(`/orders`, { method: "POST", body: JSON.stringify(orderPayload) }),
  getMyOrders: () => fetchApi(`/orders/me`),
  getTracking: (orderId: string) => fetchApi(`/orders/track/${orderId}`),
  getAdminAnalytics: () => fetchApi(`/orders/admin/analytics`),
  createPaymentIntent: (amount: number, orderId?: string) =>
    fetchApi(`/payments/create-intent`, { method: "POST", body: JSON.stringify({ amount, orderId }) }),
};

// Inventory APIs
export const inventoryApi = {
  checkStock: (productId: string) => fetchApi(`/inventory/${productId}`),
  reserveStock: (items: any[]) => fetchApi(`/inventory/reserve`, { method: "POST", body: JSON.stringify({ items }) }),
  getAdminStock: () => fetchApi(`/inventory/admin/stock`),
  updateAdminStock: (productId: string, quantity: number) =>
    fetchApi(`/inventory/admin/stock/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
};

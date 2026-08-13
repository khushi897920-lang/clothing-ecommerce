"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "./apiClient";

export type AuthState = "CHECKING" | "AUTHENTICATED" | "UNAUTHENTICATED";

export function useAuth(requireAuth: boolean = false, requiredRole?: "ADMIN" | "CUSTOMER") {
  const [authState, setAuthState] = useState<AuthState>("CHECKING");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;

    async function checkAuth() {
      const token = typeof window !== "undefined" ? localStorage.getItem("yugen_token") : null;
      const searchStr = typeof window !== "undefined" ? window.location.search : "";

      if (!token) {
        if (active) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("yugen_user");
          }
          setUser(null);
          setAuthState("UNAUTHENTICATED");
          if (requireAuth) {
            const redirectTarget = pathname + searchStr;
            router.push(`/signin?redirect=${encodeURIComponent(redirectTarget)}`);
          }
        }
        return;
      }

      // Check against real /auth/me endpoint
      const { data } = await authApi.getMe();
      if (!active) return;

      if (data && data.success && data.user) {
        if (requiredRole && data.user.role !== requiredRole) {
          // Role mismatch: redirect unauthorized user appropriately
          const target = data.user.role === "ADMIN" ? "/admin/dashboard" : "/profile";
          router.push(target);
          setAuthState("UNAUTHENTICATED");
        } else {
          setUser(data.user);
          if (typeof window !== "undefined") {
            localStorage.setItem("yugen_user", JSON.stringify(data.user));
          }
          setAuthState("AUTHENTICATED");
        }
      } else {
        // Clear invalid token / user info
        if (typeof window !== "undefined") {
          localStorage.removeItem("yugen_token");
          localStorage.removeItem("yugen_user");
        }
        setUser(null);
        setAuthState("UNAUTHENTICATED");
        if (requireAuth) {
          const redirectTarget = pathname + searchStr;
          router.push(`/signin?redirect=${encodeURIComponent(redirectTarget)}`);
        }
      }
    }

    checkAuth();

    const handleAuthExpired = () => {
      if (active) {
        const searchStr = typeof window !== "undefined" ? window.location.search : "";
        setAuthState("UNAUTHENTICATED");
        setUser(null);
        if (requireAuth) {
          const redirectTarget = pathname + searchStr;
          router.push(`/signin?redirect=${encodeURIComponent(redirectTarget)}`);
        }
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("yugen-auth-expired", handleAuthExpired);
    }

    return () => {
      active = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("yugen-auth-expired", handleAuthExpired);
      }
    };
  }, [requireAuth, requiredRole, router, pathname]);

  return { authState, user, setAuthState, setUser };
}

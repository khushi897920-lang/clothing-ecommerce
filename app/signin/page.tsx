import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInScreen } from "@/components/yugen/AuthScreens";

export const metadata: Metadata = {
  title: "Sign In | YUGEN",
  description: "Sign in to your YUGEN account.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <SignInScreen />
    </Suspense>
  );
}

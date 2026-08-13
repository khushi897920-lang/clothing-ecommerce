import { Suspense } from "react";
import type { Metadata } from "next";
import { SignUpScreen } from "@/components/yugen/AuthScreens";

export const metadata: Metadata = {
  title: "Create Account | YUGEN",
  description: "Create your YUGEN account.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0]" />}>
      <SignUpScreen />
    </Suspense>
  );
}

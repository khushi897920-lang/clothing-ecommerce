import type { Metadata } from "next";
import { SignInScreen } from "@/components/yugen/AuthScreens";

export const metadata: Metadata = {
  title: "Sign In | YUGEN",
  description: "Sign in to your YUGEN account.",
};

export default function SignInPage() {
  return <SignInScreen />;
}

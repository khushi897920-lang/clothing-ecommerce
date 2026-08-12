import type { Metadata } from "next";
import { SignUpScreen } from "@/components/yugen/AuthScreens";

export const metadata: Metadata = {
  title: "Create Account | YUGEN",
  description: "Create a new YUGEN account.",
};

export default function RegisterPage() {
  return <SignUpScreen />;
}

import type { Metadata } from "next";
import { SignUpScreen } from "@/components/yugen/AuthScreens";

export const metadata: Metadata = {
  title: "Create Account | YUGEN",
  description: "Create your YUGEN account.",
};

export default function SignUpPage() {
  return <SignUpScreen />;
}

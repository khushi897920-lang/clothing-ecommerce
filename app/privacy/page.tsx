import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/yugen/Footer";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Header } from "@/components/yugen/Header";

export const metadata: Metadata = {
  title: "Privacy Policy | YUGEN",
  description: "YUGEN Privacy Policy and Data Protection guidelines.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      <main className="max-w-[960px] mx-auto px-6 lg:px-12 py-28">
        <h1
          className="text-3xl sm:text-4xl font-light uppercase tracking-wider mb-6 text-[#25211D]"
          style={{ fontFamily: '"Poiret One", sans-serif' }}
        >
          Privacy Policy
        </h1>
        <p className="text-xs text-[#756A5E] uppercase tracking-wider mb-12">
          Effective Date: January 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[#494139]">
          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              1. Personal Data Collection
            </h2>
            <p>
              At YUGEN, we value your privacy. We collect minimal personal information necessary to process your luxury fashion orders, including your name, shipping address, email address, phone number, and encrypted payment tokens.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is exclusively used to fulfill purchases, process payments via Stripe/PayPal, dispatch shipping updates, handle customer care queries, and enhance your shopping experience.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              3. Data Protection &amp; Security
            </h2>
            <p>
              We enforce strict 256-bit SSL encryption across all API transactions. Payment card details are processed directly through Stripe PCI-DSS Level 1 compliant infrastructure and are never stored in plaintext on our servers.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              4. Cookies &amp; Tracking
            </h2>
            <p>
              We use functional session cookies to remember your shopping cart items, selected currency, and authentication status. You may disable cookies in your browser settings at any time.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/products"
            className="inline-block bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3 px-8 rounded-md uppercase tracking-wider transition-colors shadow-sm"
          >
            Explore Catalog
          </Link>
        </div>
      </main>

      <BrandValues />
      <Footer />
    </div>
  );
}

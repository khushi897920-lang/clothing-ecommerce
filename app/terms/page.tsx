import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/yugen/Footer";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Header } from "@/components/yugen/Header";

export const metadata: Metadata = {
  title: "Terms & Conditions | YUGEN",
  description: "YUGEN Terms and Conditions of Service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      <main className="max-w-[960px] mx-auto px-6 lg:px-12 py-28">
        <h1
          className="text-3xl sm:text-4xl font-light uppercase tracking-wider mb-6 text-[#25211D]"
          style={{ fontFamily: '"Poiret One", sans-serif' }}
        >
          Terms &amp; Conditions
        </h1>
        <p className="text-xs text-[#756A5E] uppercase tracking-wider mb-12">
          Effective Date: January 1, 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-[#494139]">
          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              1. Overview &amp; Acceptance
            </h2>
            <p>
              Welcome to YUGEN. By accessing or using our website, placing an order, or engaging with our quiet luxury fashion catalog, you agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              2. Orders &amp; Purchasing
            </h2>
            <p>
              All orders submitted through the storefront are subject to acceptance and stock availability. Prices are listed in USD ($) and inclusive of applicable item taxes. Discount promotional codes (e.g. YUGEN10) are valid per customer transaction.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              3. Worldwide Shipping &amp; Delivery
            </h2>
            <p>
              YUGEN ships worldwide via DHL Express standard and priority fulfillment. Orders placed are processed within 24-48 hours. Estimated delivery timelines and waybill tracking IDs are provided upon dispatch.
            </p>
          </section>

          <section className="bg-[#FBFAF6] p-6 sm:p-8 rounded-xl border border-[#463627]/12 shadow-sm space-y-3">
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#25211D]">
              4. Returns &amp; Refund Policy
            </h2>
            <p>
              Items in unworn condition with original tags intact may be returned within 30 days of receipt. Refunds will be credited to the original payment account (Stripe credit card or PayPal).
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

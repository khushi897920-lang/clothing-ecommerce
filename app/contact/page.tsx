import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/yugen/Footer";
import { BrandValues } from "@/components/yugen/BrandValues";
import { Header } from "@/components/yugen/Header";
import { Mail, Phone, MapPin, MessageSquare, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | YUGEN",
  description: "Get in touch with YUGEN Customer Concierge and Support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#25211D] font-sans antialiased">
      <Header />

      <main className="max-w-[1140px] mx-auto px-6 lg:px-12 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="eyebrow dark mb-3">Customer Concierge</p>
          <h1
            className="text-3xl sm:text-4xl font-light uppercase tracking-wider mb-4 text-[#25211D]"
            style={{ fontFamily: '"Poiret One", sans-serif' }}
          >
            Contact Us
          </h1>
          <p className="text-sm text-[#756A5E] leading-relaxed">
            Have questions about a quiet-luxury garment, shipment tracking, or custom sizing? Our concierge team is here to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#FBFAF6] p-8 rounded-xl border border-[#463627]/12 shadow-sm text-center flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D]">
              <Mail size={20} />
            </div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-[#25211D]">Email Concierge</h2>
            <p className="text-xs text-[#756A5E]">We reply within 24 hours</p>
            <a href="mailto:support@yugenstore.com" className="text-sm font-medium text-[#25211D] underline">
              support@yugenstore.com
            </a>
          </div>

          <div className="bg-[#FBFAF6] p-8 rounded-xl border border-[#463627]/12 shadow-sm text-center flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D]">
              <Phone size={20} />
            </div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-[#25211D]">Direct Phone</h2>
            <p className="text-xs text-[#756A5E]">Mon – Fri, 9am – 6pm EST</p>
            <a href="tel:+18005559843" className="text-sm font-medium text-[#25211D]">
              +1 (800) 555-9843
            </a>
          </div>

          <div className="bg-[#FBFAF6] p-8 rounded-xl border border-[#463627]/12 shadow-sm text-center flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D]">
              <MapPin size={20} />
            </div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-[#25211D]">Flagship Boutique</h2>
            <p className="text-xs text-[#756A5E]">New York, NY 10012</p>
            <p className="text-sm font-medium text-[#25211D]">
              482 Soho Avenue, New York
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-[#FBFAF6] p-8 sm:p-12 rounded-2xl border border-[#463627]/12 shadow-sm max-w-2xl mx-auto">
          <h2
            className="text-2xl font-light uppercase tracking-wider mb-6 text-[#25211D] text-center"
            style={{ fontFamily: '"Poiret One", sans-serif' }}
          >
            Send a Message
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#25211D]">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-3 px-4 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#25211D]">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-3 px-4 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#25211D]">
                Message *
              </label>
              <textarea
                rows={4}
                placeholder="How can we assist you?"
                required
                className="w-full bg-[#F7F5F0] border border-[#463627]/20 rounded-md py-3 px-4 text-xs text-[#25211D] focus:outline-none focus:border-[#25211D]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#25211D] hover:bg-[#38342F] text-white text-xs font-semibold py-3.5 rounded-md uppercase tracking-wider transition-colors shadow-sm"
            >
              Send Message
            </button>
          </form>
        </div>
      </main>

      <BrandValues />
      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { Facebook, Globe2, Instagram, Twitter } from "lucide-react";

const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "New In", href: "/products?sort=newest" },
      { label: "Women", href: "/women" },
      { label: "Men", href: "/products?gender=Men" },
      { label: "Collections", href: "/products" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/#about" },
      { label: "Sustainability", href: "/#about" },
      { label: "Lookbook", href: "/#lookbook" },
      { label: "Journal", href: "/#about" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping & Tracking", href: "/orders/track" },
      { label: "My Orders & Returns", href: "/orders" },
      { label: "FAQ", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/privacy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="site-footer" id="about">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href="/" aria-label="YUGEN home">
            YUGEN
          </Link>
          <p>
            Essence of simplicity.
            <br />
            Made to be lived in.
          </p>
          <div className="social-links flex items-center space-x-3 text-[#25211D]" aria-label="Social channels">
            <span
              className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Instagram"
              title="Instagram"
            >
              <Instagram size={14} strokeWidth={1.4} />
            </span>
            <span
              className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D] font-serif text-xs font-bold opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Pinterest"
              title="Pinterest"
            >
              P
            </span>
            <span
              className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Facebook"
              title="Facebook"
            >
              <Facebook size={14} strokeWidth={1.4} />
            </span>
            <span
              className="w-7 h-7 rounded-full bg-[#EAE6DD] flex items-center justify-center text-[#25211D] opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Twitter"
              title="Twitter"
            >
              <Twitter size={14} strokeWidth={1.4} />
            </span>
          </div>
        </div>

        {footerColumns.map((column) => (
          <nav className="footer-column" aria-label={column.title} key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link href={link.href} key={link.label}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}

        <div className="footer-bottom">
          <p>&copy; 2026 YUGEN. All rights reserved.</p>
          <p>
            <Globe2 aria-hidden="true" size={15} strokeWidth={1.35} />
            Worldwide Shipping
          </p>
          <p>Designed with purpose.</p>
        </div>
      </div>
    </footer>
  );
}

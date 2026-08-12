import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YUGEN | Essence of Simplicity",
  description:
    "A quiet-luxury fashion landing page for YUGEN, crafted with cinematic campaign video and warm editorial minimalism.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var r of registrations) { r.unregister(); }
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

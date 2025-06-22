import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";
import { AuthProvider } from "@/shared/context/auth-context";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoShop - Your Trusted Online Store",
  description:
    "Discover quality products at unbeatable prices. Fast shipping, easy returns, and exceptional customer service.",
  keywords: "ecommerce, online shopping, quality products, fast shipping",
  authors: [{ name: "EcoShop Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartStore — Mini E-Commerce",
  description: "Browse, shop, and manage your orders with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-white`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#161616",
                  color: "#f5f5f5",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: { primary: "#f97316", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
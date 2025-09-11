import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/NavBar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Page title + template for nested routes
  title: {
    default: "MyndZeal - Make your life easy with Myndzeal",
    template: "%s | MyndZeal",
  },
  description: "MyndZeal - Make your life easy with Myndzeal",
  icons: {
    icon: "/assets/logo.jpg", // existing image in public/assets
    shortcut: "/assets/logo.jpg",
    apple: "/assets/logo.jpg",
  },
  openGraph: {
    title: "MyndZeal - Make your life easy with Myndzeal",
    description: "Simplifying life management with MyndZeal",
    images: [
      {
        url: "/assets/logo.jpg",
        width: 512,
        height: 512,
        alt: "MyndZeal Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {/* Offset all pages for the fixed navbar height (published via --nav-h in Navbar) */}
          <main style={{ paddingTop: "var(--nav-h, 80px)" }} className="relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

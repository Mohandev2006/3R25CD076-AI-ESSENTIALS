import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShopProvider } from "@/context/ShopContext";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartShop AI — AI Business Assistant for Small Shops",
  description: "Simple digital assistant designed specifically for small shopkeepers to manage stock, record sales, and receive instant AI insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ShopProvider>
          <AppShell>{children}</AppShell>
        </ShopProvider>
      </body>
    </html>
  );
}

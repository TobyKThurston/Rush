import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "The Apex",
  description: "A quiet luxury-inspired 30-second daily game",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "The Apex" }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F6F2",
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ivory text-charcoal">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

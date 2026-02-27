import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Rush",
  description: "A quiet luxury-inspired 30-second daily game"
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
      </body>
    </html>
  );
}

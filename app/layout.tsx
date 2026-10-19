import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eshme-Commerce",
  description: "A seller workspace for research, sourcing and commerce operations.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

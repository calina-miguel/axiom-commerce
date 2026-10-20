import type { Metadata } from "next";
import "./globals.css";
import "./expressive-motion.css";
import "./mobile-story.css";
import AuthCallback from "./auth-callback";

export const metadata: Metadata = {
  title: "Axiom Commerce",
  description: "Find the commerce lane that fits how you actually want to sell.",
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
      <body className="antialiased"><AuthCallback />{children}</body>
    </html>
  );
}

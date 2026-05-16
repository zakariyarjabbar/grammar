import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GrammarFlow",
  description: "A clean English grammar learning platform from beginner to advanced."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-ink antialiased">{children}</body>
    </html>
  );
}

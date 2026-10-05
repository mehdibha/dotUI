import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geistGeistSans = Geist({subsets:['latin'],variable:'--font-geist-sans'});

const geistMonoGeistMono = Geist_Mono({subsets:['latin'],variable:'--font-geist-mono'});

export const metadata: Metadata = {
  title: "dotUI · Next.js example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistGeistSans.variable, geistMonoGeistMono.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

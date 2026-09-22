import "./globals.css"

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "dotUI · Next.js example",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable, geistMono.variable)}>
      <body className="bg-bg text-fg">{children}</body>
    </html>
  )
}

import "./globals.css"

import type { Metadata } from "next"
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "dotUI · Next.js example",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className="bg-bg text-fg">{children}</body>
    </html>
  )
}

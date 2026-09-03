import "./globals.css"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "dotUI · Next.js example",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-fg">{children}</body>
    </html>
  )
}

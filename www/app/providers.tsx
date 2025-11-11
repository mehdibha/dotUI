"use client";

import { useRouter } from "next/navigation";
import { NextProvider } from "fumadocs-core/framework/next";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { RouterProvider } from "react-aria-components";

import { TRPCReactProvider } from "@/lib/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <NuqsAdapter>
      <JotaiProvider>
        <RouterProvider navigate={router.push}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextProvider>
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </NextProvider>
          </ThemeProvider>
        </RouterProvider>
      </JotaiProvider>
    </NuqsAdapter>
  );
}

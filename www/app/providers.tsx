"use client";

import { useRouter } from "next/navigation";
import { NextProvider } from "fumadocs-core/framework/next";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-aria-components";

import { TRPCReactProvider } from "@/lib/trpc/react";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <JotaiProvider>
      <RouterProvider navigate={(path, options) => router.push(path as any, options)}>
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
  );
}

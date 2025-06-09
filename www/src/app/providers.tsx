"use client";

import { useRouter } from "next/navigation";
import { PreviewModeProvider } from "@/components/mode-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { Provider as JotaiProvider } from "jotai";
import { ThemeProvider } from "next-themes";
import { RouterProvider } from "react-aria-components";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({
  defaultPreviewMode,
  children,
}: {
  defaultPreviewMode: "light" | "dark" | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <JotaiProvider>
      <RouterProvider navigate={router.push}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PreviewModeProvider defaultMode={defaultPreviewMode}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </PreviewModeProvider>
        </ThemeProvider>
      </RouterProvider>
    </JotaiProvider>
  );
}

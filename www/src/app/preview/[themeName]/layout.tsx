import React from "react";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
import { themes } from "@/reg/registry-themes";
import { ThemeUpdater } from "./theme-updater";

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ themeName: string }>;
}) {
  const { themeName } = await params;
  return (
    <ThemeProvider theme={themes.find((theme) => theme.name === themeName)}>
      <ThemeUpdater />
      <div className="min-h-screen">{children}</div>
    </ThemeProvider>
  );
}

import React from "react";
import { themes } from "@/registry/registry-themes";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
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
      <div>currentTheme: {themeName}</div>
      <div className="min-h-screen">{children}</div>
    </ThemeProvider>
  );
}

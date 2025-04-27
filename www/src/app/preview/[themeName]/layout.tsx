import React from "react";
import { styles } from "@/modules/registry/registry-styles";
import { ThemeProvider } from "@/modules/styles/components/style-provider";
import { ThemeUpdater } from "./theme-updater";

export default async function PreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ styleName: string }>;
}) {
  const { styleName } = await params;
  return (
    <ThemeProvider theme={styles.find((style) => style.name === styleName)}>
      <ThemeUpdater />
      <div className="min-h-screen">{children}</div>
    </ThemeProvider>
  );
}

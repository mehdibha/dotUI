import React from "react";
import { themes } from "@/reg/registry-themes";
import { ThemeEditor } from "./theme-editor";
import { ThemeTableOfContents } from "./toc";

export default async function ThemePage({
  params,
}: {
  params: Promise<{ themeName: string }>;
}) {
  const themeName = (await params).themeName;

  const theme = themes.find((theme) => theme.name === themeName);
  const isEditable = !theme;

  return (
    <div className="mx-auto flex max-w-5xl lg:px-8 lg:pt-10">
      <div className="relative mx-auto min-h-[2000px] max-w-3xl flex-1">
        <ThemeEditor theme={theme ?? themeName} isEditable={isEditable} />
      </div>
      <ThemeTableOfContents />
    </div>
  );
}

export function generateStaticParams() {
  return themes.map((theme) => ({
    themeName: theme.name,
  }));
}

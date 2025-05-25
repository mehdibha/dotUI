import React from "react";
import { styles } from "@/modules/registry/registry-styles";
// import { ThemeEditor } from "./theme-editor";
import { ThemeTableOfContents } from "./toc";

export default async function ThemePage({
  params,
}: {
  params: Promise<{ styleName: string }>;
}) {
  const styleName = (await params).styleName;

  const style = styles.find((style) => style.name === styleName);
  const isEditable = !style;

  return (
    <div className="mx-auto flex max-w-5xl lg:px-8 lg:pt-10">
      <div className="relative mx-auto min-h-[2000px] max-w-3xl flex-1">
        {/* <ThemeEditor theme={style ?? styleName} isEditable={isEditable} /> */}
      </div>
      <ThemeTableOfContents />
    </div>
  );
}

export function generateStaticParams() {
  return styles.map((style) => ({
    styleName: style.name,
  }));
}

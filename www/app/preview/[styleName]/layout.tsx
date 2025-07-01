import React from "react";

// import { notFound } from "next/navigation";

import { ThemeUpdater } from "./theme-updater";

export default async function PreviewLayout({
  children,
  // params,
}: {
  children: React.ReactNode;
  params: Promise<{ styleName: string }>;
}) {
  // const { styleName } = await params;
  // const style = styles.find((style) => style.name === styleName);

  // if (!style) {
  //   notFound();
  // }

  return (
    <div>
      <ThemeUpdater />
      <div className="min-h-screen">{children}</div>
    </div>
  );
}

"use client";

import React from "react";
import { ThemeContent } from "./components/ThemeContent";
import { ThemeHeader } from "./components/ThemeHeader";
import { ThemeTableOfContents } from "./toc";

export default function ThemePage() {
  const [isEditMode, setEditMode] = React.useState(false);

  return (
    <div className="container flex min-h-[2000px] max-w-5xl gap-10">
      <div className="relative flex-1 pb-20 pt-10">
        <ThemeHeader isEditMode={isEditMode} setEditMode={setEditMode} />
        <ThemeContent />
      </div>
      <ThemeTableOfContents />
    </div>
  );
}

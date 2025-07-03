"use client";

import React from "react";
import { useRouter } from "next/navigation";

export function ThemeUpdater() {
  const router = useRouter();

  React.useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "UPDATE_THEME") {
        const newThemeName = event.data.themeName;
        router.push(`/preview/${newThemeName}`);
      }
    });
  }, [router]);
  return null;
}

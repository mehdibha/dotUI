"use client";

import React from "react";
import { usePreviewMode } from "@/components/mode-provider";

export default function Demo() {
  const { mode } = usePreviewMode();

  return <div className="container max-w-xs py-40">{mode}</div>;
}

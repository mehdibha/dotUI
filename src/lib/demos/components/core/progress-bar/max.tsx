"use client";

import * as React from "react";
import { ProgressBar } from "@/lib/components/core/default/progress-bar";

export default function ProgressDemo() {
  return <ProgressBar value={50} min={40} max={60} />;
}

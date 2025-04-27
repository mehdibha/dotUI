"use client";

import * as React from "react";
import { ProgressBar } from "@/components/dynamic-core/progress-bar";

export default function Demo() {
  return <ProgressBar label="Loading" showValueLabel value={75} />;
}

"use client";

import * as React from "react";
import { Progress } from "@/components/dynamic-core/progress";

export default function Demo() {
  return <Progress aria-label="loading" value={75} />;
}

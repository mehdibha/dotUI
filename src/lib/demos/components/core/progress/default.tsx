"use client";

import * as React from "react";
import { Progress } from "@/lib/components/core/default/progress";

export default function Demo() {
  return <Progress aria-label="loading" value={75} />;
}

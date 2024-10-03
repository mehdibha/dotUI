"use client";

import * as React from "react";
import { Progress } from "@/registry/ui/default/core/progress";

export default function Demo() {
  return <Progress minValue={50} maxValue={150} value={100} />;
}

"use client";

import * as React from "react";
import { Progress } from "@/registry/ui/default/core/progress";

export default function Demo() {
  return <Progress label="Loading" showValueLabel value={75} />;
}

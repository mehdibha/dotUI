"use client";

import * as React from "react";
import { Progress } from "@/components/dynamic-core/progress";

export default function Demo() {
  return <Progress label="Loading" showValueLabel value={75} />;
}

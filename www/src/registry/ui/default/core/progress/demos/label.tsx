"use client";

import * as React from "react";
import { Progress } from "@/registry/ui/default/core/progress";

export default function Demo() {
  return (
    <div className="space-y-4">
      <Progress aria-label="Loading" value={75} />
      <Progress label="Loading..." value={75} />
    </div>
  );
}

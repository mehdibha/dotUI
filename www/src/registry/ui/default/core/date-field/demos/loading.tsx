"use client";

import React from "react";
import { DateField } from "@/registry/ui/default/core/date-field";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <DateField aria-label="Meeting date" isLoading loaderPosition="prefix" />
      <DateField aria-label="Meeting date" isLoading loaderPosition="suffix" />
    </div>
  );
}

"use client";

import React from "react";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TimeField isLoading loaderPosition="prefix" />
      <TimeField isLoading loaderPosition="suffix" />
    </div>
  );
}

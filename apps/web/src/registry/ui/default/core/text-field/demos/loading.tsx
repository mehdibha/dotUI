"use client";

import React from "react";
import { TextField } from "@/registry/ui/default/core/text-field";

export default function Demo() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TextField isLoading loaderPosition="prefix" />
      <TextField isLoading loaderPosition="suffix" />
    </div>
  );
}
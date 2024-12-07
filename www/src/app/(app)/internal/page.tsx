"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";

export default function Page() {
  return (
    <React.Suspense fallback="loading">
      <Button>Salem</Button>
    </React.Suspense>
  );
}

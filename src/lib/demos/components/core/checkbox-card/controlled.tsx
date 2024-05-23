"use client";

import React from "react";
import { CheckboxCard } from "@/lib/components/core/default/checkbox/checkbox-card";

export default function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true);
  return (
    <div>
      <CheckboxCard
        isSelected={checked}
        onChange={(isSelected) => setChecked(isSelected)}
        title="Upload documents"
        description="upload documents from your computer."
      />
    </div>
  );
}

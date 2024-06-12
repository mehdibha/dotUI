"use client";

import { CheckboxCard } from "@/lib/components/core/default/checkbox/checkbox-card";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-4">
      <CheckboxCard
        isDisabled
        title="Upload documents"
        description="upload documents from your computer."
      />
      <CheckboxCard
        defaultSelected
        isDisabled
        title="Upload documents"
        description="upload documents from your computer."
      />
    </div>
  );
}

import React from "react";
import { TextArea } from "@/registry/ui/default/core/text-area";

export default function Demo() {
  return (
    <div className="flex items-center gap-4">
      <TextArea isLoading loaderPosition="prefix" />
      <TextArea isLoading loaderPosition="suffix" />
    </div>
  );
}

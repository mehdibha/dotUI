import React from "react";
import { ColorField } from "@/components/dynamic-core/color-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ColorField isLoading loaderPosition="prefix" />
      <ColorField isLoading loaderPosition="suffix" />
    </div>
  );
}

import React from "react";
import { TextField } from "@/lib/components/core/default/text-field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <TextField label="Name" defaultValue="Mehdi" />
    </div>
  );
}

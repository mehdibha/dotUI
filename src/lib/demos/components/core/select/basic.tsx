"use client";

import React from "react";
import { Select, SelectItem } from "@/lib/components/core/default/select";

export default function SelectDemo() {
  return (
    <div className="flex flex-col space-y-4">
      <Select>
        <SelectItem>Aardvark</SelectItem>
        <SelectItem>Cat</SelectItem>
        <SelectItem>Dog</SelectItem>
        <SelectItem>Kangaroo</SelectItem>
        <SelectItem>Panda</SelectItem>
        <SelectItem>Snake</SelectItem>
      </Select>
    </div>
  );
}

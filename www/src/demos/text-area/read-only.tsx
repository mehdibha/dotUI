"use client";

import React from "react";
import { TextArea } from "@/components/dynamic-core/text-area";

export default function Demo() {
  return (
    <TextArea label="Email" isReadOnly value="This is a readonly comment" />
  );
}

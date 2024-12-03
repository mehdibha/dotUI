"use client";

import React from "react";
import { TextArea } from "@/components/dynamic-core/text-area";

export default function Demo() {
  return (
    <TextArea
      isRequired
      necessityIndicator="icon"
      label="Description"
      placeholder="Type your message here"
    />
  );
}

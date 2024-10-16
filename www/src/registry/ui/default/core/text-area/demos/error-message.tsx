"use client";

import React from "react";
import { TextArea } from "@/registry/ui/default/core/text-area";

export default function Demo() {
  return (
    <TextArea
      label="Comment"
      isInvalid
      errorMessage="You have exceeded the comment limit for one hour."
    />
  );
}

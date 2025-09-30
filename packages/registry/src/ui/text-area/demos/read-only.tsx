"use client";

import React from "react";

import { TextArea } from "@dotui/registry/ui/text-area";

export default function Demo() {
  return (
    <TextArea label="Email" isReadOnly value="This is a readonly comment" />
  );
}

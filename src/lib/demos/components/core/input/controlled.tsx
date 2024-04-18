"use client";

import React from "react";
import { Input } from "@/lib/components/core/default/input";

export default function InputControlledDemo() {
  const [inputValue, setInputValue] = React.useState("Hello world!");

  return (
    <Input
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
    />
  );
}

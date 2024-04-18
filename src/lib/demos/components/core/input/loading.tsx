"use client";

import React from "react";
import { Input } from "@/lib/components/core/default/input";
import { Label } from "@/lib/components/core/default/label";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function InputLoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const debouncedInputValue = useDebounce(inputValue, 500);

  React.useEffect(() => {
    if (debouncedInputValue) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  }, [debouncedInputValue]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Input loading loaderPosition="prefix" />
        <Input loading />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Type a username"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          status={!loading && debouncedInputValue ? "success" : undefined}
          loading={loading}
        />
      </div>
    </div>
  );
}

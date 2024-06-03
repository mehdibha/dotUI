"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Label } from "@/lib/components/core/default/field";
import { RadioGroup, Radio } from "@/lib/components/core/default/radio";
import { toast } from "@/lib/components/core/default/toast";

type Type = "default" | "success" | "error" | "warning" | "info";
type Variant = "default" | "muted" | "fill";

export default function SonnerVariantsDemo() {
  const [type, setType] = React.useState<Type>("default");
  const [variant, setVariant] = React.useState<Variant>("default");
  const action = {
    default: toast,
    success: toast.success,
    warning: toast.warning,
    error: toast.error,
    info: toast.info,
  };

  return (
    <div className="flex items-center gap-16">
      <Button
        onPress={() =>
          action[type]("Event has been created", {
            variant,
          })
        }
      >
        Show toast
      </Button>
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <RadioGroup value={type} onChange={(newVal) => setType(newVal as Type)}>
            <Radio value="default">Default</Radio>
            <Radio value="success">Success</Radio>
            <Radio value="error">Error</Radio>
            <Radio value="warning">Warning</Radio>
            <Radio value="info">Info</Radio>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Variant</Label>
          <RadioGroup
            value={variant}
            onChange={(newVal) => setVariant(newVal as Variant)}
          >
            <Radio value="default">Default</Radio>
            <Radio value="muted">Muted</Radio>
            <Radio value="fill">Fill</Radio>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

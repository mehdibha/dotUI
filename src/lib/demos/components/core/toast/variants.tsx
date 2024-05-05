"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import { Label } from "@/lib/components/core/default/label";
import { RadioGroup, RadioGroupItem } from "@/lib/components/core/default/radio-group";
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
        onClick={() =>
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
          <RadioGroup value={type} onValueChange={(newVal: Type) => setType(newVal)}>
            <RadioGroupItem value="default">Default</RadioGroupItem>
            <RadioGroupItem value="success">Success</RadioGroupItem>
            <RadioGroupItem value="error">Error</RadioGroupItem>
            <RadioGroupItem value="warning">Warning</RadioGroupItem>
            <RadioGroupItem value="info">Info</RadioGroupItem>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Variant</Label>
          <RadioGroup
            value={variant}
            onValueChange={(newVal: Variant) => setVariant(newVal)}
          >
            <RadioGroupItem value="default">Default</RadioGroupItem>
            <RadioGroupItem value="muted">Muted</RadioGroupItem>
            <RadioGroupItem value="fill">Fill</RadioGroupItem>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}

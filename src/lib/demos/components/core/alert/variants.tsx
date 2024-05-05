"use client";

import React from "react";
import { Alert } from "@/lib/components/core/default/alert";
import { Label } from "@/lib/components/core/default/label";
import { RadioGroup, RadioGroupItem } from "@/lib/components/core/default/radio-group";

type Type = "default" | "success" | "danger" | "warning" | "info";
type Variant = "default" | "muted" | "fill";

export default function SonnerVariantsDemo() {
  const [type, setType] = React.useState<Type>("default");
  const [variant, setVariant] = React.useState<Variant>("default");

  return (
    <div className="flex items-center gap-16">
      <Alert variant={variant} type={type}>
        You can add components to your app using the cli.
      </Alert>
      <div className="flex gap-4">
        <div className="space-y-2">
          <Label>Type</Label>
          <RadioGroup value={type} onValueChange={(newVal: Type) => setType(newVal)}>
            <RadioGroupItem value="default">Default</RadioGroupItem>
            <RadioGroupItem value="success">Success</RadioGroupItem>
            <RadioGroupItem value="danger">Danger</RadioGroupItem>
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

"use client";

import React from "react";
import { Alert } from "@/lib/components/core/default/alert";
import { Label } from "@/lib/components/core/default/field";
import { RadioGroup, Radio } from "@/lib/components/core/default/radio";

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
          <RadioGroup value={type} onChange={(newVal) => setType(newVal as Type)}>
            <Radio value="default">Default</Radio>
            <Radio value="success">Success</Radio>
            <Radio value="danger">Danger</Radio>
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

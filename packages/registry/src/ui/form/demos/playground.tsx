"use client";

import type { Control } from "@dotui/registry/playground";
import { Button } from "@dotui/registry/ui/button";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

import { Form } from "../index";

interface FormPlaygroundProps {
  validationBehavior?: "native" | "aria";
}

export function FormPlayground({
  validationBehavior = "native",
}: FormPlaygroundProps) {
  return (
    <Form validationBehavior={validationBehavior} className="space-y-4">
      <TextField name="name" isRequired>
        <Label>Name</Label>
        <Input placeholder="Enter your name" />
      </TextField>
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
}

export const formControls: Control[] = [
  {
    type: "enum",
    name: "validationBehavior",
    label: "Validation Behavior",
    options: ["native", "aria"],
    defaultValue: "native",
  },
];


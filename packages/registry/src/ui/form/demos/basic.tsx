"use client";

import { Form } from "react-aria-components";
import type React from "react";

import { Button } from "@dotui/registry/ui/button";
import { Description, Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { TextField } from "@dotui/registry/ui/text-field";

export default function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Form onSubmit={handleSubmit} className="w-xs space-y-4">
      <TextField name="name" minLength={2} isRequired>
        <Label>Name</Label>
        <Input placeholder="Name" />
        <Description>Please enter your full name.</Description>
      </TextField>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

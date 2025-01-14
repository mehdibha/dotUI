"use client";

import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { TextField } from "@/components/dynamic-core/text-field";
import { Form } from "@/registry/core/form";

export default function Demo() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Form onSubmit={handleSubmit} className="w-xs space-y-4">
      <TextField
        name="name"
        label="Name"
        description="Please enter your full name."
        minLength={2}
        isRequired
        className="w-full"
      />
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

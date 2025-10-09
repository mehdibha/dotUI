"use client";

import { Button } from "@dotui/registry-v2/ui/button";
import { Form } from "@dotui/registry-v2/ui/form";
import { Switch } from "@dotui/registry-v2/ui/switch";
import { TextField } from "@dotui/registry-v2/ui/text-field";

export function FormDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Form submitted");
        }}
        className="space-y-4"
      >
        <TextField
          label="Name"
          name="name"
          placeholder="Enter your name"
          isRequired
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          placeholder="email@example.com"
          isRequired
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          isRequired
        />
        <Switch name="newsletter">Subscribe to newsletter</Switch>
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button type="reset" variant="quiet">
            Reset
          </Button>
        </div>
      </Form>

      <Form
        validationBehavior="native"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-4"
      >
        <TextField
          label="Username"
          name="username"
          minLength={3}
          isRequired
          description="At least 3 characters"
        />
        <TextField
          label="Website"
          name="website"
          type="url"
          placeholder="https://example.com"
        />
        <TextField
          label="Age"
          name="age"
          type="number"
          minValue={18}
          maxValue={120}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

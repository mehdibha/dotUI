"use client";

import { Button } from "@dotui/registry/ui/button";
import { Description, Label } from "@dotui/registry/ui/field";
import { Form } from "@dotui/registry/ui/form";
import { Input } from "@dotui/registry/ui/input";
import { NumberField } from "@dotui/registry/ui/number-field";
import { Switch } from "@dotui/registry/ui/switch";
import { TextField } from "@dotui/registry/ui/text-field";

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
        <TextField>
          <Label>Name</Label>
          <Input />
        </TextField>
        <TextField>
          <Label>Email</Label>
          <Input />
        </TextField>
        <TextField>
          <Label>Password</Label>
          <Input />
        </TextField>
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
        <TextField name="username" minLength={3} isRequired>
          <Label>Username</Label>
          <Input />
          <Description>At least 3 characters</Description>
        </TextField>
        <TextField>
          <Label>Website</Label>
          <Input />
        </TextField>
        <NumberField>
          <Label>Age</Label>
          <Input />
        </NumberField>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}

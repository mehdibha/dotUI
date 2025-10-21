"use client";

import { CheckboxContext } from "react-aria-components";

import { Checkbox, CheckboxIndicator } from "@dotui/registry-v2/ui/checkbox";
import { CheckboxGroup } from "@dotui/registry-v2/ui/checkbox-group";
import {
  Description,
  Field,
  FieldContent,
  FieldGroup,
  Label,
} from "@dotui/registry-v2/ui/field";

export function CheckboxDemo() {
  return (
    <div className="space-y-4">
      {/* Simple Checkbox */}
      <CheckboxContext value={{ isDisabled: true }}>
        <div className="flex items-center gap-2">
          <Checkbox />
          <Checkbox defaultSelected />
          <Checkbox isIndeterminate />
          <Checkbox isDisabled />
          <Checkbox isDisabled defaultSelected />
        </div>

        {/* Checkbox with Label */}
        <Checkbox>
          <CheckboxIndicator />
          <Label>I accept the terms and conditions</Label>
        </Checkbox>

        <Checkbox isDisabled>
          <CheckboxIndicator />
          <Label>I accept the terms and conditions</Label>
        </Checkbox>

        {/* Checkbox with Label and Description */}
        <Checkbox>
          <CheckboxIndicator />
          <FieldContent>
            <Label>I accept the terms and conditions</Label>
            <Description>
              By clicking this checkbox, you agree to the terms and conditions.
            </Description>
          </FieldContent>
        </Checkbox>

        {/* With Field */}
        <Field orientation="horizontal">
          <Checkbox isDisabled />
          <FieldContent>
            <Label>I accept the terms and conditions</Label>
            <Description>
              By clicking this checkbox, you agree to the terms and conditions.
            </Description>
          </FieldContent>
        </Field>

        {/* Card style */}
        <Checkbox className="w-fit rounded-md border bg-neutral p-4 transition-colors selected:border-border-accent selected:bg-accent-muted">
          <CheckboxIndicator />
          <FieldContent>
            <Label>I accept the terms and conditions</Label>
            <Description>
              By clicking this checkbox, you agree to the terms and conditions.
            </Description>
          </FieldContent>
        </Checkbox>

        {/* Checkbox Group */}
        <CheckboxGroup>
          <Label>React frameworks</Label>
          <div className="space-y-1">
            <Checkbox value="nextjs" className="items-center">
              <CheckboxIndicator />
              Next.js
            </Checkbox>
            <Checkbox value="remix" className="items-center">
              <CheckboxIndicator />
              Remix
            </Checkbox>
            <Checkbox value="gatsby" className="items-center">
              <CheckboxIndicator />
              Gatsby
            </Checkbox>
          </div>
        </CheckboxGroup>

        <CheckboxGroup>
          <Label>React frameworks</Label>
          <div className="space-y-2">
            <Checkbox value="nextjs" className="items-center">
              <CheckboxIndicator />
              <Label>Tanstack Start</Label>
            </Checkbox>
            <Checkbox value="remix" className="items-center">
              <CheckboxIndicator />
              <Label>Next.js</Label>
            </Checkbox>
            <Checkbox value="gatsby" className="items-center">
              <CheckboxIndicator />
              <Label>Remix</Label>
            </Checkbox>
          </div>
        </CheckboxGroup>

        <CheckboxGroup>
          <Label>React frameworks</Label>
          <div className="space-y-2">
            <Checkbox value="nextjs" className="items-center">
              <CheckboxIndicator />
              <FieldContent>
                <Label>Next.js</Label>
                <Description>React framework for production</Description>
              </FieldContent>
            </Checkbox>
            <Checkbox value="remix" className="items-center">
              <CheckboxIndicator />
              <FieldContent>
                <Label>Remix</Label>
                <Description>Full-stack web framework</Description>
              </FieldContent>
            </Checkbox>
            <Checkbox value="gatsby" className="items-center">
              <CheckboxIndicator />
              <FieldContent>
                <Label>Gatsby</Label>
                <Description>Static site generator</Description>
              </FieldContent>
            </Checkbox>
          </div>
        </CheckboxGroup>
      </CheckboxContext>
    </div>
  );
}

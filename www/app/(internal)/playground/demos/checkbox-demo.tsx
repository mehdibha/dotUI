"use client";

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
      <div className="flex items-center gap-2">
        <Checkbox />
        <Checkbox defaultSelected />
        <Checkbox isIndeterminate />
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
      <Checkbox className="w-fit rounded-md border bg-card p-4 transition-colors selected:border-border-accent selected:bg-accent-muted">
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
        <FieldGroup>
          <Checkbox value="nextjs">
            <CheckboxIndicator />
            Next.js
          </Checkbox>
          <Checkbox value="remix">
            <CheckboxIndicator />
            Remix
          </Checkbox>
          <Checkbox value="gatsby">
            <CheckboxIndicator />
            Gatsby
          </Checkbox>
        </FieldGroup>
        <Description>Please select your preferred frameworks.</Description>
      </CheckboxGroup>

      <CheckboxGroup>
        <Label>React frameworks</Label>
        <FieldGroup>
          <Checkbox value="nextjs">
            <CheckboxIndicator />
            <Label>Tanstack Start</Label>
          </Checkbox>
          <Checkbox value="remix">
            <CheckboxIndicator />
            <Label>Next.js</Label>
          </Checkbox>
          <Checkbox value="gatsby">
            <CheckboxIndicator />
            <Label>Remix</Label>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>

      <CheckboxGroup>
        <Label>React frameworks</Label>
        <FieldGroup>
          <Checkbox value="nextjs">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Next.js</Label>
              <Description>React framework for production</Description>
            </FieldContent>
          </Checkbox>
          <Checkbox value="remix">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Remix</Label>
              <Description>Full-stack web framework</Description>
            </FieldContent>
          </Checkbox>
          <Checkbox value="gatsby">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Gatsby</Label>
              <Description>Static site generator</Description>
            </FieldContent>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>

      <CheckboxGroup>
        <Label>React frameworks</Label>
        <FieldGroup className="*:rounded-md *:border *:p-4 *:bg-card *:transition-colors *:selected:border-border-accent *:selected:bg-accent-muted">
          <Checkbox value="nextjs">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Tanstack Start</Label>
              <Description>React framework for production</Description>
            </FieldContent>
          </Checkbox>
          <Checkbox value="remix">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Next.js</Label>
              <Description>React framework for production</Description>
            </FieldContent>
          </Checkbox>
          <Checkbox value="gatsby">
            <CheckboxIndicator />
            <FieldContent>
              <Label>Remix</Label>
              <Description>React framework for production</Description>
            </FieldContent>
          </Checkbox>
        </FieldGroup>
      </CheckboxGroup>
    </div>
  );
}

"use client";

import { Description, FieldError, Label } from "@dotui/registry-v2/ui/field";

export function FieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label>Field Label</Label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 text-sm"
          placeholder="Enter text..."
        />
        <Description>This is a helpful description for the field.</Description>
      </div>

      <div className="space-y-2">
        <Label>Required Field *</Label>
        <input
          type="email"
          className="w-full rounded-md border border-danger px-3 py-2 text-sm"
          placeholder="email@example.com"
        />
        <FieldError>Please enter a valid email address.</FieldError>
      </div>

      <div className="space-y-2">
        <Label>
          <span>Label with icon</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="inline-block"
          >
            <path
              fillRule="evenodd"
              d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-6 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM7.293 5.293a1 1 0 1 1 1.414 1.414L8.414 7H9a1 1 0 1 1 0 2H8.414l.293.293a1 1 0 1 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2Z"
              clipRule="evenodd"
            />
          </svg>
        </Label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2 text-sm"
        />
        <Description>
          Additional information about this field that helps users understand
          what to enter.
        </Description>
      </div>

      <div className="space-y-2">
        <Label>Disabled Field</Label>
        <input
          type="text"
          disabled
          className="w-full rounded-md border bg-muted px-3 py-2 text-sm text-fg-disabled"
          value="Disabled input"
          readOnly
        />
        <Description>This field is disabled and cannot be edited.</Description>
      </div>
    </div>
  );
}

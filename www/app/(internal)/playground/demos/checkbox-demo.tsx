"use client";

import { Checkbox, CheckboxIndicator } from "@dotui/registry-v2/ui/checkbox";
import {
  Description,
  Field,
  FieldContent,
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
      <Field>
        <Checkbox />
        <FieldContent>
          <Label>I accept the terms and conditions</Label>
          <Description>
            By clicking this checkbox, you agree to the terms and conditions.
          </Description>
        </FieldContent>
      </Field>

      {/* Card style */}
      <Checkbox className="w-fit rounded-md border p-4 transition-colors bg-neutral selected:border-border-accent selected:bg-accent-muted">
        <CheckboxIndicator />
        <FieldContent>
          <Label>I accept the terms and conditions</Label>
          <Description>
            By clicking this checkbox, you agree to the terms and conditions.
          </Description>
        </FieldContent>
      </Checkbox>
    </div>
  );
}

// <CheckboxGroup>
//   <Label>I accept the terms and conditions</Label>
//   <FieldGroup>
//     <Field>
//       <Checkbox />
//       <FieldContent>
//         <Label>I accept the terms and conditions</Label>
//         <Description>
//           By clicking this checkbox, you agree to the terms and conditions.
//         </Description>
//       </FieldContent>
//     </Field>
//     <Field>
//       <Checkbox />
//       <FieldContent>
//         <Label>I accept the terms and conditions</Label>
//         <Description>
//           By clicking this checkbox, you agree to the terms and conditions.
//         </Description>
//       </FieldContent>
//     </Field>
//   </FieldGroup>
//   <FieldError />
// </CheckboxGroup>;

// <Checkbox>
//   <CheckboxIndicator />
//   Hello world
// </Checkbox>

//   <Checkbox>
//     <CheckboxIndicator />
//     <FieldContent>
//       <Label>I accept the terms and conditions</Label>
//       <Description>
//         By clicking this checkbox, you agree to the terms and conditions.
//       </Description>
//     </FieldContent>
//   </Checkbox>

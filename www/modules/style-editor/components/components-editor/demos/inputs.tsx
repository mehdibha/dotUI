import { EyeOffIcon } from "lucide-react";

import { Description, FieldError, Label } from "@dotui/registry/ui/field";
import {
  Input,
  InputAddon,
  InputGroup,
  TextArea,
} from "@dotui/registry/ui/input";
import { SearchField } from "@dotui/registry/ui/search-field";
import { TextField } from "@dotui/registry/ui/text-field";

import { getComponentVariants } from "@/modules/style-editor/components/components-editor/demos/utils";
import { Section } from "@/modules/style-editor/components/components-editor/section";

export function Inputs() {
  return (
    <Section
      name="inputs"
      title="Inputs"
      variants={getComponentVariants("input")}
      previewClassName="grid grid-cols-2 gap-3 *:w-auto"
    >
      <TextField form="none" aria-label="Email" className="col-span-2">
        <Input placeholder="hello@mehdibha.com" />
      </TextField>
      <TextField
        form="none"
        aria-label="Password"
        defaultValue="123456"
        className="col-span-2"
      >
        <InputGroup>
          <Input type="password" />
          <InputAddon>
            <EyeOffIcon />
          </InputAddon>
        </InputGroup>
      </TextField>
      <TextField form="none" className="col-span-2">
        <Label>Email</Label>
        <Input />
        <Description>Enter your email</Description>
      </TextField>
      <TextField form="none" aria-label="https://" className="col-span-2">
        <InputGroup>
          <InputAddon>https://</InputAddon>
          <Input />
        </InputGroup>
      </TextField>
      <TextField form="none" aria-label="@dotui.org" className="col-span-2">
        <InputGroup>
          <Input />
          <InputAddon>@dotui.org</InputAddon>
        </InputGroup>
      </TextField>
      <TextField
        form="none"
        aria-label="Email"
        isInvalid
        className="col-span-2"
      >
        <Input placeholder="Email" />
        <FieldError>This email is already taken.</FieldError>
      </TextField>
      <SearchField form="none" aria-label="Search..." className="col-span-2">
        <Input placeholder="Search..." />
      </SearchField>
      <TextField form="none" className="col-span-2">
        <Label>Description</Label>
        <TextArea />
        <Description>Type your description</Description>
      </TextField>
    </Section>
  );
}

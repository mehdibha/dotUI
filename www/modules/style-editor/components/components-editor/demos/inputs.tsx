import { EyeOffIcon } from "lucide-react";

import { SearchField } from "@dotui/ui/components/search-field";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";

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
      <TextField
        form="none"
        aria-label="Email"
        placeholder="hello@mehdibha.com"
        className="col-span-2"
      />
      <TextField
        form="none"
        aria-label="Password"
        type="password"
        defaultValue="123456"
        suffix={<EyeOffIcon />}
        className="col-span-2"
      />
      <TextField
        form="none"
        label="Email"
        description="Enter your email"
        className="col-span-2"
      />
      <TextField
        form="none"
        aria-label="https://"
        prefix={<span>https://</span>}
        className="col-span-2"
      />
      <TextField
        form="none"
        aria-label="@dotui.org"
        suffix={<span>@dotui.org</span>}
        className="col-span-2"
      />
      <TextField
        form="none"
        aria-label="Email"
        placeholder="Email"
        isInvalid
        errorMessage="This email is already taken."
        className="col-span-2"
      />
      <SearchField
        form="none"
        aria-label="Search..."
        placeholder="Search..."
        className="col-span-2"
      />
      <TextArea
        form="none"
        label="Description"
        description="Type your description"
        className="col-span-2"
      />
    </Section>
  );
}

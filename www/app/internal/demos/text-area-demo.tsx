import { ArrowDownIcon, ChevronDownIcon, InfoIcon } from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { ButtonGroup } from "@dotui/registry-v2/ui/button-group";
import { Label } from "@dotui/registry-v2/ui/field";
import { TextArea } from "@dotui/registry-v2/ui/text-area";

export function TextAreaDemo() {
  return (
    <div className="flex flex-wrap gap-10 [&_[data-slot=text-area]]:w-full *:[div]:w-full *:[div]:max-w-sm">
      <div className="space-y-4">
        <TextArea label="Default" placeholder="Type your message here" />
        <TextArea
          label="Disabled"
          placeholder="Type your message here"
          isDisabled
        />
        <TextArea
          label="Read Only"
          placeholder="Type your message here"
          isReadOnly
          defaultValue="This is a read only text area"
        />
        <TextArea
          label="With description"
          placeholder="Type your message here"
          isRequired
        />
        <TextArea
          label="Invalid"
          placeholder="Type your message here"
          isInvalid
        />
        <TextArea
          label="Error Message"
          placeholder="Type your message here"
          isInvalid
          errorMessage="This is an error message"
        />
      </div>
      <div className="space-y-4">
        <TextArea
          prefix={
            <span className="flex items-center justify-between gap-2">
              <Label>First name</Label>
              <InfoIcon />
            </span>
          }
        />
        <TextArea
          label="With suffix"
          suffix={
            <span className="flex items-center justify-between gap-2">
              <span>20/240 characters</span>
              <InfoIcon />
            </span>
          }
        />
        <TextArea
          label="With buttons"
          suffix={
            <span className="flex items-center justify-between gap-2">
              <ButtonGroup>
                <Button size="sm">Button</Button>
                <Button shape="square" size="sm">
                  <ChevronDownIcon />
                </Button>
              </ButtonGroup>
              <span className="flex items-center gap-1">
                <Button size="sm">Cancel</Button>
                <Button size="sm" variant="primary">
                  Post
                </Button>
              </span>
            </span>
          }
        />
      </div>
    </div>
  );
}

"use client";

import { IconCheck, IconPlayerRecordFilled } from "@tabler/icons-react";
import {
  CheckIcon,
  CopyIcon,
  EyeClosedIcon,
  EyeIcon,
  InfoIcon,
  MailIcon,
  MicIcon,
  StarIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { Label } from "@dotui/registry-v2/ui/field";
import { Kbd } from "@dotui/registry-v2/ui/kbd";
import { Loader } from "@dotui/registry-v2/ui/loader";
import { Select } from "@dotui/registry-v2/ui/select";
import { TextField } from "@dotui/registry-v2/ui/text-field";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";

export function TextFieldDemo() {
  return (
    <div className="flex flex-wrap gap-10 [&_[data-slot=text-field]]:w-full *:[div]:w-full *:[div]:max-w-sm">
      <div className="space-y-6">
        <TextField label="Default" />
        <TextField label="Disabled" isDisabled />
        <TextField label="Required" isRequired />
        <TextField label="Invalid" isInvalid />
        <TextField label="Read Only" isReadOnly />
        <TextField
          label="With error message"
          isInvalid
          errorMessage="This is an error message"
        />
        <TextField label="Icon left" prefix={<MailIcon />} />
        <TextField label="Icon right" suffix={<EyeClosedIcon />} />
        <TextField
          label="Icon (both)"
          prefix={<MicIcon />}
          suffix={
            <IconPlayerRecordFilled className="animate-pulse text-red-500" />
          }
        />
        <TextField
          label="Multiple icons"
          prefix={
            <IconPlayerRecordFilled className="animate-pulse text-red-500" />
          }
          suffix={
            <span className="flex items-center gap-1">
              <StarIcon />
              <Button variant="quiet" className="size-6 px-0 [&_svg]:size-4">
                <CopyIcon />
              </Button>
            </span>
          }
        />
        <TextField
          label="Description"
          description="This is a description for the TextField"
        />
       
      </div>
      <div className="space-y-4">
        <TextField
          label="Tooltip"
          suffix={
            <Tooltip content="This is content in a tooltip">
              <Button
                variant="quiet"
                shape="square"
                size="sm"
                className="size-6"
              >
                <InfoIcon />
              </Button>
            </Tooltip>
          }
        />
        <TextField
          label="Dropdown"
          prefix={
            <Select.Root className="w-auto" defaultValue="+216">
              <Select.Button variant="quiet" size="sm" className="h-6 px-2">
                <Select.Value />
              </Select.Button>
              <Select.Popover>
                <Select.ListBox>
                  <Select.Item id="+1">+1</Select.Item>
                  <Select.Item id="+44">+44</Select.Item>
                  <Select.Item id="+216">+216</Select.Item>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          }
        />
        <div className="space-y-2">
          <TextField label="Label" />
          <TextField prefix={<Label>Label</Label>} />
        </div>
        <div className="space-y-2">
          <TextField
            label="Button"
            prefix={<Button variant="quiet" size="sm" className="h-6">Button</Button>}
          />
          <TextField
            label="Button"
            prefix={<Button variant="default" size="sm" className="h-6">Button</Button>}
          />
          <TextField
            label="Button"
            suffix={<Button variant="default" size="sm" className="h-6">Button</Button>}
          />
          <TextField
            label="Button"
            suffix={<Button variant="quiet" size="sm" className="h-6">Button</Button>}
          />
        </div>
        <div className="grid grid-cols-2 items-start gap-4">
          <TextField label="Firstname" suffix={<InfoIcon />} />
          <TextField label="Lastname" suffix={<InfoIcon />} />
        </div>
        <div className="space-y-2">
          <TextField label="Textfield with kbd" prefix={<Kbd>⌘K</Kbd>} />
          <TextField aria-label="Textfield with kbd" suffix={<Kbd>⌘K</Kbd>} />
          <TextField
            aria-label="Textfield with kbd"
            placeholder="Search for apps..."
            suffix={
              <span className="flex items-center gap-2">
                <span>Ask AI</span>
                <Kbd>Tab</Kbd>
              </span>
            }
          />
          <TextField
            aria-label="Textfield with kbd"
            placeholder="Type to search..."
            suffix={
              <span className="flex items-center gap-1">
                <Kbd>Ctrl</Kbd>
                <Kbd>C</Kbd>
              </span>
            }
          />
        </div>
        <TextField
          label="Username"
          defaultValue="mehdibha"
          description="This username is available."
          suffix={
            <span className="flex size-4 items-center justify-center rounded-full bg-success text-fg-on-success">
              <CheckIcon className="size-3" />
            </span>
          }
          className="[&_[slot=description]]:text-fg-success"
        />
        <TextField
          label="Loading"
          defaultValue="mehdibha"
          suffix={<Loader className="size-4" />}
        />
      </div>
    </div>
  );
}

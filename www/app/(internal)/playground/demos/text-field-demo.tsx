"use client";

import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import {
  ArrowUpIcon,
  CheckIcon,
  EditIcon,
  PlusIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import { TextField } from "react-aria-components";

import { cn } from "@dotui/registry-v2/lib/utils";
import { Button } from "@dotui/registry-v2/ui/button";
import {
  Input,
  InputAddon,
  InputGroup,
  TextArea,
} from "@dotui/registry-v2/ui/input";
import { SearchField } from "@dotui/registry-v2/ui/search-field";
import { Select } from "@dotui/registry-v2/ui/select";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";
import { SearchIcon } from "@dotui/registry/icons";

export function TextFieldDemo() {
  const isTrue = false;
  return (
    <div className="space-y-4 *:w-96">
      {/* <TextField defaultValue="@mehdibha" className="w-full">
        <Input placeholder="Input" className="w-full" />
      </TextField>

      <TextArea placeholder="TextArea" /> */}

      <div>
        <Button>{isTrue ? <span>X</span> : <XIcon />}</Button>
      </div>

      <InputGroup>
        <InputAddon>$</InputAddon>
        <Input placeholder="InputGroup + Input" className="w-auto! flex-1!" />
        <InputAddon>USD</InputAddon>
      </InputGroup>

      <InputGroup>
        <TextArea
          placeholder="Type your message"
          className="transition-[height]"
        />
        <InputAddon>120 characters left</InputAddon>
      </InputGroup>

      <InputGroup>
        <InputAddon>
          <SearchIcon />
        </InputAddon>
        <Input placeholder="InputGroup + Input" />
        <InputAddon>12 results</InputAddon>
      </InputGroup>

      {(["sm", "md", "lg"] as const).map((size) => (
        <InputGroup key={size} size={size}>
          <Input placeholder="example.com" />
          <InputAddon>
            <Tooltip content="This is content in a tooltip.">
              <Button variant="quiet">
                <SendIcon />
              </Button>
            </Tooltip>
          </InputAddon>
        </InputGroup>
      ))}

      <InputGroup>
        <TextArea placeholder="Ask, search or chat..." />
        <InputAddon>
          <Button>
            <PlusIcon />
          </Button>
          <Select defaultValue="auto" className="w-fit">
            <Select.Trigger />
            <Select.Popover>
              <Select.List>
                <Select.Item id="auto">Auto</Select.Item>
                <Select.Item id="agent">Agent</Select.Item>
                <Select.Item id="manual">Manual</Select.Item>
              </Select.List>
            </Select.Popover>
          </Select>
          <span className="ml-auto">52% used</span>
          <Button
            aria-label="Send"
            variant="default"
            isDisabled
            className="rounded-full"
          >
            <ArrowUpIcon />
          </Button>
        </InputAddon>
      </InputGroup>

      <TextField value="@mehdibha">
        <InputGroup>
          <Input />
          <InputAddon>
            <div className="flex size-4 items-center justify-center rounded-full bg-primary text-fg-on-primary">
              <IconCheck className="size-3" />
            </div>
          </InputAddon>
        </InputGroup>
      </TextField>
    </div>
  );
}

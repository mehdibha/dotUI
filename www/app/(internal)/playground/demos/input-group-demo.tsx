"use client";

import Link from "next/link";
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

export function InputGroupDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 *:space-y-4">
      <div>
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

        <InputGroup>
          <Input defaultValue="@mehdibha" />
          <InputAddon>
            <div className="flex size-4 items-center justify-center rounded-full bg-primary text-fg-on-primary">
              <IconCheck className="size-3" />
            </div>
          </InputAddon>
        </InputGroup>
      </div>

      <div>
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
              <Select.Trigger aspect="default" />
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
              variant="primary"
              className="rounded-full"
            >
              <ArrowUpIcon />
            </Button>
          </InputAddon>
        </InputGroup>
      </div>
    </div>
  );
}

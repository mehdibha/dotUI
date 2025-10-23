"use client";

import { useState } from "react";
import {
  IconArrowRight,
  IconBrandGithubCopilot,
  IconChevronDown,
  IconCloudCode,
  IconHeart,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  ChevronDownIcon,
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  MoreHorizontalIcon,
  PercentIcon,
  RotateCwIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { ButtonGroup } from "@dotui/registry-v2/ui/button-group";
import { ColorSwatchPicker } from "@dotui/registry-v2/ui/color-swatch-picker";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import {
  Input,
  InputAddon,
  InputGroup,
  TextArea,
} from "@dotui/registry-v2/ui/input";
import { Menu, MenuContent, MenuItem } from "@dotui/registry-v2/ui/menu";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import { Separator } from "@dotui/registry-v2/ui/separator";
import { Text } from "@dotui/registry-v2/ui/text";
import { TextField } from "@dotui/registry-v2/ui/text-field";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";
import { SearchIcon } from "@dotui/registry/icons";

export function ButtonGroupDemo() {
  const [_currency, _setCurrency] = useState("$");
  return (
    <div className="flex flex-wrap gap-8">
      <div className="flex max-w-md flex-col gap-6">
        <ButtonGroup>
          <Button variant="primary">Button</Button>
          <Button variant="primary">
            Get Started <IconArrowRight />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="primary">Button</Button>
          <Separator />
          <Button variant="primary">
            Get Started <IconArrowRight />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Input placeholder="Type something here..." />
          <Button>Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Button</Button>
          <Input placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <Button>Button</Button>
          <Button>Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Text>Text</Text>
          <Button>Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Label>
            <IconCloudCode /> GPU Size
          </Label>
          <Input placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <Text>Prefix</Text>
          <Input placeholder="Type something here..." />
          <Text>Suffix</Text>
        </ButtonGroup>
        <div className="flex gap-4">
          <ButtonGroup>
            <Button>Update</Button>
            <Menu>
              <Button>
                <ChevronDownIcon />
              </Button>
              <Overlay type="popover">
                <MenuContent>
                  <MenuItem>Disable</MenuItem>
                  <MenuItem variant="danger">Uninstall</MenuItem>
                </MenuContent>
              </Overlay>
            </Menu>
          </ButtonGroup>
          <ButtonGroup className="[--radius-factor:999]">
            <Button>Follow</Button>
            <Menu>
              <Button>
                <ChevronDownIcon />
              </Button>
              <Overlay type="popover">
                <MenuContent>
                  <MenuItem>Mute Conversation</MenuItem>
                  <MenuItem>Mark as Read</MenuItem>
                  <MenuItem>Report Conversation</MenuItem>
                  <MenuItem>Block User</MenuItem>
                  <MenuItem>Share Conversation</MenuItem>
                  <MenuItem>Copy Conversation</MenuItem>
                  <MenuItem variant="danger">Delete Conversation</MenuItem>
                </MenuContent>
              </Overlay>
            </Menu>
          </ButtonGroup>
          <ButtonGroup className="[--radius-factor:0.9]">
            <Button>Actions</Button>
            <Separator />
            <Menu>
              <Button>
                <MoreHorizontalIcon />
              </Button>
              <Overlay type="popover">
                <MenuContent>
                  <MenuItem>Select Messages</MenuItem>
                  <MenuItem>Edit Pins</MenuItem>
                  <MenuItem>Set Up Name & Photo</MenuItem>
                  <MenuItem>Delete Messages</MenuItem>
                  <MenuItem variant="danger">Delete Pins</MenuItem>
                </MenuContent>
              </Overlay>
            </Menu>
          </ButtonGroup>
        </div>
        <TextField>
          <Label>Amount</Label>
          <ButtonGroup>
            {/* <Select
              placeholder="Select currency"
              value={currency}
              onChange={(key) => setCurrency(key as string)}
              className="w-fit"
            >
              <Select.Trigger aspect="default" className="rounded-r-none">
                <Select.Value />
                <ChevronDownIcon />
              </Select.Trigger>
              <Select.Popover>
                <Select.List>
                  <Select.Item id="$">$</Select.Item>
                  <Select.Item id="€">€</Select.Item>
                  <Select.Item id="£">£</Select.Item>
                </Select.List>
              </Select.Popover>
            </Select> */}
            <Input placeholder="Enter amount to send" />
            <Button>
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
        </TextField>
      </div>
      <div className="flex max-w-sm flex-col gap-6">
        <ButtonGroup className="[--spacing:0.2rem]">
          <Button>
            <FlipHorizontalIcon />
          </Button>
          <Button>
            <FlipVerticalIcon />
          </Button>
          <Button>
            <RotateCwIcon />
          </Button>
          <InputGroup>
            <InputAddon>
              <PercentIcon />
            </InputAddon>
            <Input placeholder="Enter percentage" />
          </InputGroup>
        </ButtonGroup>
        <div className="flex gap-2 [--radius:0.95rem] [--ring:var(--color-blue-300)] [--spacing:0.22rem] **:[.shadow-xs]:shadow-none">
          <InputGroup>
            <InputAddon>
              <SearchIcon />
            </InputAddon>
            <Input placeholder="Type to search..." />
          </InputGroup>
          <ButtonGroup>
            <Button>
              <IconBrandGithubCopilot />
            </Button>
            <Dialog>
              <Button aspect="default">
                <IconCloudCode />
                <IconChevronDown />
              </Button>
              <Dialog.Popover>
                <Dialog.Content className="">
                  <Dialog.Header className="border-b">
                    <Dialog.Heading>Agent Tasks</Dialog.Heading>
                  </Dialog.Header>
                  <Separator />
                  <Dialog.Body>
                    <TextArea
                      placeholder="Describe your task in natural language."
                      className="mb-4 w-full resize-none"
                    />
                    <p className="font-medium">Start a new task with Copilot</p>
                    <p className="text-muted-foreground">
                      Describe your task in natural language. Copilot will work
                      in the background and open a pull request for your review.
                    </p>
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Popover>
            </Dialog>
          </ButtonGroup>
        </div>
        <div className="grid grid-cols-2 gap-4 [--spacing:0.22rem]">
          <ButtonGroup>
            <InputGroup>
              <InputAddon>W</InputAddon>
              <Input id="width" className="w-16" />
              <InputAddon>px</InputAddon>
            </InputGroup>
            <Button>
              <IconMinus />
            </Button>
            <Button>
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ButtonGroup className="w-full">
            <InputGroup>
              <InputAddon>
                <Dialog>
                  <Button variant="quiet">
                    <span className="size-4 rounded-xs bg-blue-600" />
                  </Button>
                  <Dialog.Popover>
                    <Dialog.Content>
                      <ColorSwatchPicker>
                        {[
                          "#EA4335", // Red
                          "#FBBC04", // Yellow
                          "#34A853", // Green
                          "#4285F4", // Blue
                          "#9333EA", // Purple
                          "#EC4899", // Pink
                          "#10B981", // Emerald
                          "#F97316", // Orange
                          "#6366F1", // Indigo
                          "#14B8A6", // Teal
                          "#8B5CF6", // Violet
                          "#F59E0B", // Amber
                        ].map((color) => (
                          <ColorSwatchPicker.Item key={color} color={color} />
                        ))}
                      </ColorSwatchPicker>
                    </Dialog.Content>
                  </Dialog.Popover>
                </Dialog>
              </InputAddon>
              <Input className="w-16" />
              <InputAddon>%</InputAddon>
            </InputGroup>
          </ButtonGroup>
        </div>
        <ButtonGroup>
          <Button>
            <IconHeart /> Like
          </Button>
          <Text>1.2K</Text>
        </ButtonGroup>
        <ButtonGroup>
          <Input aria-label="Select export type" />
          {/* <Select defaultValue="pdf" className="w-fit">
            <Select.Trigger aspect="default" className="rounded-l-none">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Popover>
              <Select.List>
                <Select.Item id="pdf">pdf</Select.Item>
                <Select.Item id="xlsx">xlsx</Select.Item>
                <Select.Item id="csv">csv</Select.Item>
                <Select.Item id="json">json</Select.Item>
              </Select.List>
            </Select.Popover>
          </Select> */}
        </ButtonGroup>
        <ButtonGroup>
          {/* <Select defaultValue="hours" className="w-fit">
            <Select.Trigger aspect="default" className="rounded-r-none">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Popover>
              <Select.List>
                <Select.Item id="hours">Hours</Select.Item>
                <Select.Item id="days">Days</Select.Item>
                <Select.Item id="weeks">Weeks</Select.Item>
              </Select.List>
            </Select.Popover>
          </Select> */}
          <Input aria-label="Select duration" />
        </ButtonGroup>
        <ButtonGroup className="[--radius-factor:9999]">
          <ButtonGroup>
            <Button>
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <InputGroup>
              <InputAddon>
                <Tooltip content="Use Voice Mode">
                  <Button variant="quiet" size="sm" className="size-7">
                    <AudioLinesIcon />
                  </Button>
                </Tooltip>
              </InputAddon>
              <Input placeholder="Send a message..." />
            </InputGroup>
          </ButtonGroup>
        </ButtonGroup>
        <ButtonGroup>
          <Button size="sm">
            <ArrowLeftIcon />
            Previous
          </Button>
          <Button size="sm">1</Button>
          <Button size="sm">2</Button>
          <Button size="sm">3</Button>
          <Button size="sm">4</Button>
          <Button size="sm">5</Button>
          <Button size="sm">
            Next
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup className="[--radius:0.9rem] [--spacing:0.22rem]">
          <ButtonGroup>
            <Button>1</Button>
            <Button>2</Button>
            <Button>3</Button>
            <Button>4</Button>
            <Button>5</Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button>
              <ArrowLeftIcon />
            </Button>
            <Button>
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroup>
            <Button>
              <ArrowLeftIcon />
            </Button>
            <Button>
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Single navigation button">
            <Button>
              <ArrowLeftIcon />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
        <div>
          <Label id="alignment-label">Text Alignment</Label>
          <ButtonGroup aria-labelledby="alignment-label">
            <Button size="sm">Left</Button>
            <Button size="sm">Center</Button>
            <Button size="sm">Right</Button>
            <Button size="sm">Justify</Button>
          </ButtonGroup>
        </div>
      </div>
      <div className="flex max-w-xs flex-col gap-6">
        <div className="flex gap-6">
          <ButtonGroup orientation="vertical" aria-label="Media controls">
            <Button>
              <IconPlus />
            </Button>
            <Button>
              <IconMinus />
            </Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical" aria-label="Design tools palette">
            <ButtonGroup orientation="vertical">
              <Button>
                <SearchIcon />
              </Button>
              <Button>
                <CopyIcon />
              </Button>
              <Button>
                <ShareIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <Button>
                <FlipHorizontalIcon />
              </Button>
              <Button>
                <FlipVerticalIcon />
              </Button>
              <Button>
                <RotateCwIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button>
                <TrashIcon />
              </Button>
            </ButtonGroup>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button size="sm">
              <IconPlus /> Increase
            </Button>
            <Button size="sm">
              <IconMinus /> Decrease
            </Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button size="sm">
              <IconPlus /> Increase
            </Button>
            <Separator orientation="horizontal" />
            <Button size="sm">
              <IconMinus /> Decrease
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

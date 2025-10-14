"use client";

import { useState } from "react";
import {
  IconArrowRight,
  IconBrandGithubCopilot,
  IconChevronDown,
  IconCircleCheck,
  IconCloudCode,
  IconHeart,
  IconMinus,
  IconPin,
  IconPlus,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AudioLinesIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  MoreHorizontalIcon,
  PercentIcon,
  RotateCwIcon,
  SearchIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@dotui/registry-v2/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogRoot,
} from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { Input, InputRoot } from "@dotui/registry-v2/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry-v2/ui/list-box";
import { Menu, MenuItem, MenuRoot } from "@dotui/registry-v2/ui/menu";
import { Popover } from "@dotui/registry-v2/ui/popover";
import { SearchField } from "@dotui/registry-v2/ui/search-field";
import { Select, SelectItem, SelectValue } from "@dotui/registry-v2/ui/select";
import { Separator } from "@dotui/registry-v2/ui/separator";
import { TextArea } from "@dotui/registry-v2/ui/text-area";
import { TextField } from "@dotui/registry-v2/ui/text-field";
import { Tooltip } from "@dotui/registry-v2/ui/tooltip";

export function ButtonGroupDemo() {
  const [currency, setCurrency] = useState("$");
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
          <Button>Button</Button>
          <ButtonGroupSeparator />
          <Button>
            Get Started <IconArrowRight />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Button</Button>
          <TextField placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <TextField placeholder="Type something here..." />
          <Button>Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Button</Button>
          <Button>Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>Text</ButtonGroupText>
          <Button>Another Button</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText asChild>
            <Label>
              <IconCloudCode /> GPU Size
            </Label>
          </ButtonGroupText>
          <TextField placeholder="Type something here..." />
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>Prefix</ButtonGroupText>
          <TextField placeholder="Type something here..." />
          <ButtonGroupText>Suffix</ButtonGroupText>
        </ButtonGroup>
        <div className="flex gap-4">
          <ButtonGroup>
            <Button>Update</Button>
            <MenuRoot>
              <Button>
                <ChevronDownIcon />
              </Button>
              <Menu>
                <MenuItem>Disable</MenuItem>
                <MenuItem variant="danger">Uninstall</MenuItem>
              </Menu>
            </MenuRoot>
          </ButtonGroup>
          <ButtonGroup className="[--radius:9999px]">
            <Button>Follow</Button>
            <MenuRoot>
              <Button>
                <ChevronDownIcon />
              </Button>
              <Menu>
                <MenuItem>Mute Conversation</MenuItem>
                <MenuItem>Mark as Read</MenuItem>
                <MenuItem>Report Conversation</MenuItem>
                <MenuItem>Block User</MenuItem>
                <MenuItem>Share Conversation</MenuItem>
                <MenuItem>Copy Conversation</MenuItem>
                <MenuItem variant="danger">Delete Conversation</MenuItem>
              </Menu>
            </MenuRoot>
          </ButtonGroup>
          <ButtonGroup className="[--radius:0.9rem]">
            <Button>Actions</Button>
            <ButtonGroupSeparator />
            <MenuRoot>
              <Button>
                <MoreHorizontalIcon />
              </Button>
              <Menu>
                <MenuItem>Select Messages</MenuItem>
                <MenuItem>Edit Pins</MenuItem>
                <MenuItem>Set Up Name & Photo</MenuItem>
                <MenuItem>Delete Messages</MenuItem>
                <MenuItem variant="danger">Delete Pins</MenuItem>
              </Menu>
            </MenuRoot>
          </ButtonGroup>
        </div>
        <div>
          <Label>Amount</Label>
          <ButtonGroup>
            {/* <SelectRoot
              placeholder="Select currency"
              value={currency}
              onChange={(key) => setCurrency(key as string)}
            >
              <Button>
                <SelectValue />
              </Button>
              <Popover>
                <ListBox>
                  <SelectItem id="$">$</SelectItem>
                  <SelectItem id="€">€</SelectItem>
                  <SelectItem id="£">£</SelectItem>
                </ListBox>
              </Popover>
            </SelectRoot> */}
            <TextField placeholder="Enter amount to send" />
            <Button variant="primary">
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
        </div>
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
          <TextField suffix={<PercentIcon />} />
        </ButtonGroup>
        <div className="flex gap-2 [--radius:0.95rem] [--ring:var(--color-blue-300)] [--spacing:0.22rem] **:[.shadow-xs]:shadow-none">
          <SearchField placeholder="Type to search..." />
          <ButtonGroup>
            <Button>
              <IconBrandGithubCopilot />
            </Button>
            <DialogRoot>
              <Button>
                <IconCloudCode />
                <IconChevronDown />
              </Button>
              <Popover
                placement="bottom"
                className="max-w-sm rounded-xl p-0 text-sm"
              >
                <DialogContent className="p-0">
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium">Agent Tasks</div>
                  </div>
                  <Separator />
                  <div className="p-4 *:[p:not(:last-child)]:mb-2">
                    <TextArea
                      placeholder="Describe your task in natural language."
                      className="mb-4 w-full resize-none"
                    />
                    <p className="font-medium">Start a new task with Copilot</p>
                    <p className="text-muted-foreground">
                      Describe your task in natural language. Copilot will work
                      in the background and open a pull request for your review.
                    </p>
                  </div>
                </DialogContent>
              </Popover>
            </DialogRoot>
          </ButtonGroup>
        </div>
        <div className="grid grid-cols-2 gap-4 [--spacing:0.22rem]">
          <ButtonGroup>
            <InputRoot className="w-auto">
              <span className="text-fg-muted">W</span>
              <Input id="width" />
              <span className="text-muted-foreground">px</span>
            </InputRoot>
            <Button shape="square">
              <IconMinus />
            </Button>
            <Button shape="square">
              <IconPlus />
            </Button>
          </ButtonGroup>
          {/* <ButtonGroup className="w-full">
            <InputRoot>
              <Input id="color" />
              <span>
                <DialogRoot>
                  <Button>
                    <span className="rounded-xs size-4 bg-blue-600" />
                  </Button>
                  <Dialog type="popover">
                    <div className="flex flex-wrap gap-1.5">
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
                        <div
                          key={color}
                          className="size-6 cursor-pointer rounded-sm transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </Dialog>
                </DialogRoot>
              </span>
              <span className="text-muted-foreground">%</span>
            </InputRoot>
          </ButtonGroup> */}
        </div>
        {/* </FieldGroup> */}
        <ButtonGroup>
          <Button>
            <IconHeart /> Like
          </Button>
          {/* hmmmmmm */}
          <Button className="text-muted-foreground pointer-events-none px-2">
            <span>1.2K</span>
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <TextField />
          <Select placeholder="Select export type">
            <SelectItem id="pdf">pdf</SelectItem>
            <SelectItem id="xlsx">xlsx</SelectItem>
            <SelectItem id="csv">csv</SelectItem>
            <SelectItem id="json">json</SelectItem>
          </Select>
        </ButtonGroup>
        <ButtonGroup>
          <Select placeholder="Select duration">
            <SelectItem id="hours">Hours</SelectItem>
            <SelectItem id="days">Days</SelectItem>
            <SelectItem id="weeks">Weeks</SelectItem>
          </Select>
          <TextField />
        </ButtonGroup>
        <ButtonGroup className="[--radius:9999rem]">
          <ButtonGroup>
            <Button shape="square">
              <IconPlus />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <TextField
              placeholder="Send a message..."
              suffix={
                <Tooltip content="Use Voice Mode">
                  <Button
                    variant="quiet"
                    shape="square"
                    size="sm"
                    className="size-7"
                  >
                    <AudioLinesIcon />
                  </Button>
                </Tooltip>
              }
            />
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
            <Button shape="square">
              <ArrowLeftIcon />
            </Button>
            <Button shape="square">
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
            <Button shape="square">
              <ArrowLeftIcon />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      <div className="flex max-w-xs flex-col gap-6">
        <div>
          <Label id="alignment-label">Text Alignment</Label>
          <ButtonGroup aria-labelledby="alignment-label">
            <Button size="sm">Left</Button>
            <Button size="sm">Center</Button>
            <Button size="sm">Right</Button>
            <Button size="sm">Justify</Button>
          </ButtonGroup>
        </div>
        <div className="flex gap-6">
          <ButtonGroup
            orientation="vertical"
            aria-label="Media controls"
            className="h-fit"
          >
            <Button shape="square">
              <IconPlus />
            </Button>
            <Button shape="square">
              <IconMinus />
            </Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical" aria-label="Design tools palette">
            <ButtonGroup orientation="vertical">
              <Button shape="square">
                <SearchIcon />
              </Button>
              <Button shape="square">
                <CopyIcon />
              </Button>
              <Button shape="square">
                <ShareIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup orientation="vertical">
              <Button shape="square">
                <FlipHorizontalIcon />
              </Button>
              <Button shape="square">
                <FlipVerticalIcon />
              </Button>
              <Button shape="square">
                <RotateCwIcon />
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button shape="square">
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
            <ButtonGroupSeparator orientation="horizontal" />
            <Button size="sm">
              <IconMinus /> Decrease
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

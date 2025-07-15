"use client";

import { parseDate } from "@internationalized/date";
import {
  ArrowRightIcon,
  BoldIcon,
  BookmarkIcon,
  Edit2Icon,
  EyeOffIcon,
  ItalicIcon,
  PinIcon,
  SendIcon,
} from "lucide-react";

import { Badge } from "@dotui/ui/components/badge";
import { Button } from "@dotui/ui/components/button";
import { Calendar, RangeCalendar } from "@dotui/ui/components/calendar";
import { Checkbox } from "@dotui/ui/components/checkbox";
import { Combobox, ComboboxItem } from "@dotui/ui/components/combobox";
import { DatePicker } from "@dotui/ui/components/date-picker";
import { DateRangePicker } from "@dotui/ui/components/date-range-picker";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogRoot,
} from "@dotui/ui/components/dialog";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Loader } from "@dotui/ui/components/loader";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { Radio, RadioGroup } from "@dotui/ui/components/radio-group";
import { SearchField } from "@dotui/ui/components/search-field";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";
import { Switch } from "@dotui/ui/components/switch";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import { cn } from "@dotui/ui/lib/utils";
import type { VariantsDefinition } from "@dotui/style-engine/types";

import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";

interface SectionProps extends React.ComponentProps<"div"> {
  name: keyof VariantsDefinition;
  title: string;
  variants: { id: string; label: string }[];
  previewClassName?: string;
}

const Section = ({
  name,
  title,
  variants,
  previewClassName,
  children,
  className,
  ...props
}: SectionProps) => {
  const { form, isSuccess } = useStyleForm();
  return (
    <div className={cn(className)} {...props}>
      <p
        className={cn("text-base font-semibold", title !== "Loader" && "mt-6")}
      >
        {title}
      </p>
      <FormControl
        name={`variants.${name}`}
        control={form.control}
        render={({ value, onChange, ...props }) => (
          <Skeleton show={!isSuccess}>
            <Select
              className="mt-2"
              selectedKey={value}
              onSelectionChange={onChange}
              {...props}
            >
              {variants.map((variant) => (
                <SelectItem key={variant.id} id={variant.id}>
                  {variant.label}
                </SelectItem>
              ))}
            </Select>
          </Skeleton>
        )}
      />
      <div
        className={cn(
          "mt-2 flex items-center justify-center gap-2 rounded-md border bg-bg-muted/50 p-4",
          previewClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export function StyleComponentsEditor() {
  return (
    <div>
      <Section
        name="loader"
        title="Loader"
        variants={[
          { id: "dots", label: "Dots" },
          { id: "lines", label: "Line" },
          { id: "ring", label: "Ring" },
          { id: "tailspin", label: "Tailspin" },
          { id: "wave", label: "Wave" },
        ]}
        previewClassName="gap-4"
      >
        <Loader />
        <Button isPending>Submit</Button>
      </Section>

      <Section
        name="focus-style"
        title="Focus style"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Button className="ring-2 ring-offset-2 ring-offset-bg">
            Button
          </Button>
          <TextField
            placeholder="hello@mehdibha.com"
            className="[&>*]:ring-2 [&>*]:ring-border-focus"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button>Button</Button>
          <TextField placeholder="hello@mehdibha.com" />
        </div>
      </Section>

      <Section
        name="buttons"
        title="Buttons"
        variants={[
          { id: "basic", label: "Basic" },
          { id: "brutalist", label: "Brutalist" },
          { id: "outline", label: "Outline" },
          { id: "ripple", label: "Ripple" },
        ]}
        previewClassName="flex-col"
      >
        <div className="flex items-center gap-2">
          <Button>Default</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="quiet">Quiet</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger">Destructive</Button>
          <Button variant="success">Secondary</Button>
          <Button variant="warning">Warning</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button prefix={<SendIcon />}>Send</Button>
          <Button suffix={<ArrowRightIcon />}>Learn more</Button>
        </div>
        <div className="flex items-center gap-2">
          <ToggleButton
            variant="primary"
            aria-label="Toggle pin"
            shape="square"
          >
            <PinIcon />
          </ToggleButton>
          <ToggleButton variant="accent" aria-label="Toggle bold">
            <BoldIcon />
          </ToggleButton>
          <ToggleButton prefix={<Edit2Icon />} shape="rectangle">
            Edit mode
          </ToggleButton>
          <ToggleButton aria-label="Toggle " isDisabled>
            <BoldIcon />
          </ToggleButton>
          <ToggleButton
            aria-label="Toggle italic"
            shape="rectangle"
            prefix={<ItalicIcon />}
            defaultSelected
          >
            Italic
          </ToggleButton>
          <ToggleButton
            aria-label="Toggle book"
            variant="primary"
            className="selected:[&_svg]:fill-fg-onPrimary"
          >
            <BookmarkIcon />
          </ToggleButton>
        </div>
      </Section>

      <Section
        name="inputs"
        title="Inputs"
        variants={[
          { id: "basic", label: "Basic" },
          { id: "brutalist", label: "Brutalist" },
          { id: "outline", label: "Outline" },
          { id: "ripple", label: "Ripple" },
        ]}
        previewClassName="grid grid-cols-2 gap-3"
      >
        <TextField placeholder="hello@mehdibha.com" className="w-full" />
        <TextField
          aria-label="Password"
          type="password"
          defaultValue="123456"
          suffix={<EyeOffIcon />}
          className="w-full"
        />
        <TextField
          label="Email"
          description="Enter your email"
          className="col-span-2 w-full"
        />
        <TextField
          aria-label="https://"
          prefix={<span>https://</span>}
          className="w-full"
        />
        <TextField
          aria-label="@dotui.org"
          suffix={<span>@dotui.org</span>}
          className="w-full"
        />
        <TextField
          placeholder="Email"
          isInvalid
          errorMessage="This email is already taken."
          className="col-span-2 w-full"
        />
        <SearchField placeholder="Search..." className="col-span-2 w-full" />
        <TextArea
          label="Description"
          description="Type your description"
          className="col-span-2 w-full"
        />
      </Section>

      <Section
        name="pickers"
        title="Pickers"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="grid grid-cols-2 gap-2"
      >
        <Combobox
          aria-label="country"
          defaultSelectedKey="tunisia"
          className="w-full"
        >
          <ComboboxItem id="canada">Canada</ComboboxItem>
          <ComboboxItem id="spain">Spain</ComboboxItem>
          <ComboboxItem id="tunisia">Tunisia</ComboboxItem>
          <ComboboxItem id="germany">Germany</ComboboxItem>
          <ComboboxItem id="france">France</ComboboxItem>
          <ComboboxItem id="united-states">United states</ComboboxItem>
          <ComboboxItem id="united-kingdom">United Kingdom</ComboboxItem>
        </Combobox>
        <DatePicker className="w-full" />
        <DateRangePicker className="w-full" />
      </Section>

      <Section
        name="selection"
        title="Selection"
        variants={[{ id: "basic", label: "Basic" }]}
      >
        <Select>
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </Select>
      </Section>

      <Section
        name="calendars"
        title="Calendars"
        variants={[{ id: "basic", label: "Basic" }]}
      >
        <Calendar defaultValue={parseDate("2020-02-03")} />
        <RangeCalendar
          defaultValue={{
            start: parseDate("2020-02-03"),
            end: parseDate("2020-02-12"),
          }}
        />
      </Section>

      <Section
        name="list-box-and-menu"
        title="ListBox and menu"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="gap-4"
      >
        <ListBox>
          <ListBoxItem>Next.js</ListBoxItem>
          <ListBoxItem>Remix</ListBoxItem>
          <ListBoxItem>Astro</ListBoxItem>
          <ListBoxItem>Gatsby</ListBoxItem>
        </ListBox>
        <div className="flex flex-col gap-2">
          <Select className="w-48">
            <SelectItem id="option-1">Option 1</SelectItem>
            <SelectItem id="option-2">Option 2</SelectItem>
            <SelectItem id="option-3">Option 3</SelectItem>
          </Select>
          <Combobox>
            <ComboboxItem>Canada</ComboboxItem>
            <ComboboxItem>France</ComboboxItem>
            <ComboboxItem>Germany</ComboboxItem>
            <ComboboxItem>Spain</ComboboxItem>
            <ComboboxItem>Tunisia</ComboboxItem>
            <ComboboxItem>United states</ComboboxItem>
            <ComboboxItem>United Kingdom</ComboboxItem>
          </Combobox>
        </div>
        <MenuRoot>
          <Button>Menu</Button>
          <Menu>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </Menu>
        </MenuRoot>
      </Section>
      <Section
        name="overlays"
        title="Overlays"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="gap-4"
      >
        <DialogRoot>
          <Button>Popover</Button>
          <Dialog title="Popover" type="popover">
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogRoot>
        <DialogRoot>
          <Button>Modal</Button>
          <Dialog title="Modal" type="modal">
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogRoot>
        <DialogRoot>
          <Button>Drawer</Button>
          <Dialog title="Drawer" type="drawer">
            <DialogBody>some content</DialogBody>
            <DialogFooter>
              <Button slot="close">Cancel</Button>
              <Button variant="primary" slot="close">
                Save changes
              </Button>
            </DialogFooter>
          </Dialog>
        </DialogRoot>
      </Section>
      <Section
        name="checkboxes"
        title="Checkboxes"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="gap-4"
      >
        <Checkbox aria-label="Basic checkbox" />
        <Checkbox defaultSelected>Hello world</Checkbox>
        <Checkbox appearance="card" defaultSelected>
          Hello world
        </Checkbox>
      </Section>
      <Section
        name="radios"
        title="Radios"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="flex-col gap-4"
      >
        <RadioGroup>
          <Radio value="option-1">Option 1</Radio>
          <Radio value="option-2">Option 2</Radio>
          <Radio value="option-3">Option 3</Radio>
        </RadioGroup>
        <RadioGroup variant="card" orientation="horizontal">
          <Radio value="option-1">Option 1</Radio>
          <Radio value="option-2">Option 2</Radio>
          <Radio value="option-3">Option 3</Radio>
        </RadioGroup>
      </Section>
      <Section
        name="switch"
        title="Switch"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Switch aria-label="Basic switch" />
          <Switch defaultSelected>Notifications</Switch>
          <Switch variant="card" defaultSelected>
            Dark mode
          </Switch>
        </div>
      </Section>
      <Section
        name="slider"
        title="Slider"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="flex-col gap-4"
      >
        <Slider defaultValue={50} aria-label="Basic slider" />
      </Section>
      <Section
        name="badge-and-tag-group"
        title="Badge & TagGroup"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Badge>Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </Section>
      <Section
        name="tooltip"
        title="Tooltip"
        variants={[{ id: "basic", label: "Basic" }]}
        previewClassName="gap-4"
      >
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      </Section>
    </div>
  );
}

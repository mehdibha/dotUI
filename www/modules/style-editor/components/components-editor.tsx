"use client";

import React from "react";
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

import { registryUi } from "@dotui/registry-definition/registry-ui";
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

import { DraftStyleProvider } from "@/modules/style-editor/components/draft-style-provider";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { ColorTokens } from "./color-tokens";

function getComponentVariants(
  componentName: string,
): { name: string; label: string }[] {
  return registryUi
    .filter((item) => item.name.startsWith(`${componentName}:`))
    .map((item) => {
      const variant = item.name.split(":")[1];
      if (!variant) {
        return null;
      }
      return {
        name: variant,
        label: variant.charAt(0).toUpperCase() + variant.slice(1),
      };
    })
    .filter((variant) => variant !== null);
}

interface SectionProps extends React.ComponentProps<"div"> {
  name: keyof VariantsDefinition;
  title: string;
  variants: { name: string; label: string }[];
  previewClassName?: string;
  tokens?: string[];
}

const Section = ({
  name,
  title,
  variants,
  tokens,
  previewClassName,
  children,
  className,
  ...props
}: SectionProps) => {
  const form = useStyleEditorForm();
  const { isSuccess } = useEditorStyle();

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
              aria-label="Select component variant"
              className="mt-2 w-full"
              selectedKey={value}
              onSelectionChange={onChange}
              {...props}
            >
              {variants.map((variant) => (
                <SelectItem key={variant.name} id={variant.name}>
                  {variant.label}
                </SelectItem>
              ))}
            </Select>
          </Skeleton>
        )}
      />

      {tokens && <ColorTokens hideHeader tokenIds={tokens} className="mt-2" />}
      <Skeleton show={!isSuccess}>
        <DraftStyleProvider
          className={cn(
            "mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-8",
            previewClassName,
          )}
        >
          {children}
        </DraftStyleProvider>
      </Skeleton>
    </div>
  );
};

export function ComponentsEditor() {
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    if (isPending) {
      setTimeout(() => setIsPending(false), 2000);
    }
  }, [isPending]);

  return (
    <div>
      <Section
        name="loader"
        title="Loader"
        variants={getComponentVariants("loader")}
        previewClassName="gap-4"
      >
        <Loader />
        <Button isPending>Submit</Button>
        <Button
          variant="primary"
          isPending={isPending}
          onPress={() => setIsPending(true)}
        >
          Submit
        </Button>
      </Section>

      <Section
        name="focus-style"
        title="Focus style"
        variants={[
          { name: "basic", label: "Basic" },
          { name: "minimal", label: "Minimal" },
        ]}
        tokens={["color-border-focus", "color-border-focus-muted"]}
        previewClassName="flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Button>Button</Button>
          <TextField
            aria-label="Email"
            placeholder="hello@mehdibha.com"
            form="none"
          />
          <Checkbox aria-label="Checkbox example" form="none" />
        </div>
      </Section>

      <Section
        name="buttons"
        title="Buttons"
        variants={getComponentVariants("button")}
        previewClassName="flex-col"
      >
        <div className="flex items-center gap-2">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="quiet">Quiet</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
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
            className="selected:[&_svg]:fill-fg-on-primary"
          >
            <BookmarkIcon />
          </ToggleButton>
        </div>
      </Section>

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

      <Section
        name="pickers"
        title="Pickers"
        variants={getComponentVariants("combobox")}
        previewClassName="flex flex-col gap-2 *:w-64 justify-center"
      >
        <Combobox aria-label="country" form="none">
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Spain</ComboboxItem>
          <ComboboxItem>Tunisia</ComboboxItem>
          <ComboboxItem>United states</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
        </Combobox>
        <DatePicker aria-label="Basic date picker" form="none" />
        <DateRangePicker aria-label="Basic date range picker" form="none" />
      </Section>

      <Section
        name="selection"
        title="Selection"
        variants={getComponentVariants("select")}
      >
        <Select
          aria-label="Basic select"
          form="none"
          defaultSelectedKey="option-1"
        >
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </Select>
      </Section>

      <Section
        name="calendars"
        title="Calendars"
        variants={getComponentVariants("calendar")}
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
        variants={getComponentVariants("list-box")}
        previewClassName="gap-4"
      >
        <ListBox aria-label="Basic list box">
          <ListBoxItem>Next.js</ListBoxItem>
          <ListBoxItem>Remix</ListBoxItem>
          <ListBoxItem>Astro</ListBoxItem>
          <ListBoxItem>Gatsby</ListBoxItem>
        </ListBox>
        <div className="flex flex-col gap-2">
          <Select className="w-48" aria-label="Basic select" form="none">
            <SelectItem id="option-1">Option 1</SelectItem>
            <SelectItem id="option-2">Option 2</SelectItem>
            <SelectItem id="option-3">Option 3</SelectItem>
          </Select>
          <Combobox aria-label="Country" form="none">
            <ComboboxItem>Canada</ComboboxItem>
            <ComboboxItem>France</ComboboxItem>
            <ComboboxItem>Germany</ComboboxItem>
            <ComboboxItem>Spain</ComboboxItem>
            <ComboboxItem>Tunisia</ComboboxItem>
            <ComboboxItem>United states</ComboboxItem>
            <ComboboxItem>United Kingdom</ComboboxItem>
          </Combobox>
        </div>
        <MenuRoot aria-label="Basic menu">
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
        variants={getComponentVariants("popover")}
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
        variants={getComponentVariants("checkbox")}
        previewClassName="gap-4"
      >
        <Checkbox aria-label="Basic checkbox" form="none" />
        <Checkbox defaultSelected form="none">
          Hello world
        </Checkbox>
        <Checkbox appearance="card" defaultSelected form="none">
          Hello world
        </Checkbox>
      </Section>

      <Section
        name="radios"
        title="Radios"
        variants={getComponentVariants("radio-group")}
        previewClassName="flex-col gap-4"
      >
        <RadioGroup
          aria-label="Basic radio group"
          defaultValue="option-1"
          form="none"
        >
          <Radio value="option-1">Option 1</Radio>
          <Radio value="option-2">Option 2</Radio>
          <Radio value="option-3">Option 3</Radio>
        </RadioGroup>
        <RadioGroup
          variant="card"
          orientation="horizontal"
          aria-label="Card radio group"
          defaultValue="option-1"
          form="none"
        >
          <Radio value="option-1">Option 1</Radio>
          <Radio value="option-2">Option 2</Radio>
          <Radio value="option-3">Option 3</Radio>
        </RadioGroup>
      </Section>

      <Section
        name="switch"
        title="Switch"
        variants={getComponentVariants("switch")}
        previewClassName="flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <Switch aria-label="Basic switch" form="none" />
          <Switch defaultSelected>Notifications</Switch>
          <Switch variant="card" defaultSelected form="none">
            Dark mode
          </Switch>
        </div>
      </Section>

      <Section
        name="slider"
        title="Slider"
        variants={getComponentVariants("slider")}
        previewClassName="flex-col gap-4"
      >
        <Slider defaultValue={50} aria-label="Basic slider" />
      </Section>

      <Section
        name="badge-and-tag-group"
        title="Badge & TagGroup"
        variants={getComponentVariants("badge")}
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
        variants={getComponentVariants("tooltip")}
        previewClassName="gap-4"
      >
        <Tooltip content="This is a tooltip">
          <Button>Hover me</Button>
        </Tooltip>
      </Section>
    </div>
  );
}

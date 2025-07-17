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

import { registryUi } from "@dotui/registry-definition/registry-ui";
import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";
import { Calendar, RangeCalendar } from "@dotui/ui/components/calendar";
import { Checkbox } from "@dotui/ui/components/checkbox";
import { Combobox, ComboboxItem } from "@dotui/ui/components/combobox";
import { DatePicker } from "@dotui/ui/components/date-picker";
import { DateRangePicker } from "@dotui/ui/components/date-range-picker";
import { FormControl } from "@dotui/ui/components/form";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Loader } from "@dotui/ui/components/loader";
import { Popover } from "@dotui/ui/components/popover";
import { SearchField } from "@dotui/ui/components/search-field";
import {
  Select,
  SelectItem,
  SelectRoot,
  SelectValue,
} from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { ChevronsUpDownIcon } from "@dotui/ui/icons";
import { cn } from "@dotui/ui/lib/utils";
import type { VariantsDefinition } from "@dotui/style-engine/types";

import { useStyleForm } from "@/modules/styles/providers/style-pages-provider";
import { usePreferences } from "../atoms/preferences-atom";

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
  const { form, isSuccess } = useStyleForm();
  const { currentMode } = usePreferences();
  const style = form.watch();

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
                <SelectItem key={variant.name} id={variant.name}>
                  {variant.label}
                </SelectItem>
              ))}
            </Select>
          </Skeleton>
        )}
      />
      <Skeleton show={!isSuccess}>
        <StyleProvider
          mode={currentMode}
          style={style}
          className={cn(
            "mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-8",
            previewClassName,
          )}
        >
          {children}
        </StyleProvider>
      </Skeleton>
    </div>
  );
};

export function StyleComponentsEditor() {
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
      </Section>

      <Section
        name="focus-style"
        title="Focus style"
        variants={[
          { name: "basic", label: "Basic" },
          { name: "minimal", label: "Minimal" },
        ]}
        tokens={["border-focus", "border-focus-muted"]}
        previewClassName="flex-col gap-4"
      >
        {/* <div className="flex items-center gap-4">
          <Button className="focus-ring-demo">Button</Button>
          <TextFieldRoot placeholder="hello@mehdibha.com">
            <TextFieldInput className="focus-ring-input-demo" />
          </TextFieldRoot>
        </div> */}
        <div className="flex items-center gap-4">
          <Button>Button</Button>
          <TextField placeholder="hello@mehdibha.com" />
          <Checkbox />
          {/* <CheckboxRoot>
            <CheckboxIndicator />
          </CheckboxRoot> */}
        </div>
      </Section>

      {/* <Section
        name="buttons"
        title="Buttons"
        variants={getComponentVariants("button")}
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
      </Section> */}

      {/* <Section
        name="inputs"
        title="Inputs"
        variants={getComponentVariants("input")}
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
      </Section> */}

      {/* <Section
        name="pickers"
        title="Pickers"
        variants={getComponentVariants("combobox")}
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
      </Section> */}

      {/* <Section
        name="selection"
        title="Selection"
        variants={getComponentVariants("select")}
      >
        <Select defaultSelectedKey="option-1">
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </Select>
      </Section> */}

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

      {/* <Section
        name="list-box-and-menu"
        title="ListBox and menu"
        variants={getComponentVariants("list-box")}
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
      </Section> */}

      {/* 
      <Section
        name="checkboxes"
        title="Checkboxes"
        variants={getComponentVariants("checkbox")}
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
        variants={getComponentVariants("radio-group")}
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
        variants={getComponentVariants("switch")}
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
      </Section> */}
    </div>
  );
}

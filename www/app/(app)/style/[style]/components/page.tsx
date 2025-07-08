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

import { Button } from "@dotui/ui/components/button";
import { Calendar, RangeCalendar } from "@dotui/ui/components/calendar";
import { Combobox, ComboboxItem } from "@dotui/ui/components/combobox";
import { DatePicker } from "@dotui/ui/components/date-picker";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Loader } from "@dotui/ui/components/loader";
import { SearchField } from "@dotui/ui/components/search-field";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { TextArea } from "@dotui/ui/components/text-area";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { cn } from "@dotui/ui/lib/utils";

interface SectionProps extends React.ComponentProps<"div"> {
  title: string;
  variants: { id: string; label: string }[];
  defaultVariant: string;
  previewClassName?: string;
}

const Section = ({
  title,
  variants,
  defaultVariant,
  previewClassName,
  children,
  className,
  ...props
}: SectionProps) => {
  return (
    <div className={cn(className)} {...props}>
      <p
        className={cn("text-base font-semibold", title !== "Loader" && "mt-6")}
      >
        {title}
      </p>
      <Select className="mt-2" defaultSelectedKey={defaultVariant}>
        {variants.map((variant) => (
          <SelectItem key={variant.id} id={variant.id}>
            {variant.label}
          </SelectItem>
        ))}
      </Select>
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

export default function StyleComponentsPage() {
  return (
    <div>
      <Section
        title="Loader"
        variants={[
          { id: "dots", label: "Dots" },
          { id: "lines", label: "Line" },
          { id: "ring", label: "Ring" },
          { id: "tailspin", label: "Tailspin" },
          { id: "wave", label: "Wave" },
        ]}
        defaultVariant="ring"
        previewClassName="gap-4"
      >
        <Loader />
        <Button isPending>Submit</Button>
      </Section>

      <Section
        title="Focus style"
        variants={[{ id: "basic", label: "Basic" }]}
        defaultVariant="basic"
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
        title="Buttons"
        variants={[
          { id: "basic", label: "Basic" },
          { id: "brutalist", label: "Brutalist" },
          { id: "outline", label: "Outline" },
          { id: "ripple", label: "Ripple" },
        ]}
        defaultVariant="basic"
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
        title="Inputs"
        variants={[
          { id: "basic", label: "Basic" },
          { id: "brutalist", label: "Brutalist" },
          { id: "outline", label: "Outline" },
          { id: "ripple", label: "Ripple" },
        ]}
        defaultVariant="basic"
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
        title="Pickers"
        variants={[{ id: "basic", label: "Basic" }]}
        defaultVariant="basic"
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
      </Section>

      <Section
        title="Selection"
        variants={[{ id: "basic", label: "Basic" }]}
        defaultVariant="basic"
      >
        <Select>
          <SelectItem id="option-1">Option 1</SelectItem>
          <SelectItem id="option-2">Option 2</SelectItem>
          <SelectItem id="option-3">Option 3</SelectItem>
        </Select>
      </Section>

      <Section
        title="Calendars"
        variants={[{ id: "basic", label: "Basic" }]}
        defaultVariant="basic"
      >
        <Calendar defaultValue={parseDate("2020-02-03")} />
        <RangeCalendar
          defaultValue={{
            start: parseDate("2020-02-03"),
            end: parseDate("2020-02-12"),
          }}
          className="w-full"
        />
      </Section>

      <Section
        title="ListBox"
        variants={[{ id: "basic", label: "Basic" }]}
        defaultVariant="basic"
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
      </Section>
    </div>
  );
}

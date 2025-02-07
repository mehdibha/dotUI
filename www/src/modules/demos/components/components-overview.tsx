"use client";

import { MenuIcon, PinIcon, UploadIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/core/link";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import BadgeVariants from "@/components/demos/badge/variants";
import FileTriggerDemo from "@/components/demos/file-trigger/default";
import { Alert } from "@/components/dynamic-core/alert";
import { Avatar } from "@/components/dynamic-core/avatar";
import { Button } from "@/components/dynamic-core/button";
import { RangeCalendar } from "@/components/dynamic-core/calendar";
import { Checkbox } from "@/components/dynamic-core/checkbox";
import { ColorPicker } from "@/components/dynamic-core/color-picker";
import { ColorSlider } from "@/components/dynamic-core/color-slider";
import { Combobox, ComboboxItem } from "@/components/dynamic-core/combobox";
import { DatePicker } from "@/components/dynamic-core/date-picker";
import { DropZone, DropZoneLabel } from "@/components/dynamic-core/drop-zone";
import { ListBox, ListBoxItem } from "@/components/dynamic-core/list-box";
import { Menu, MenuItem, MenuRoot } from "@/components/dynamic-core/menu";
import { NumberField } from "@/components/dynamic-core/number-field";
import { ProgressBar } from "@/components/dynamic-core/progress-bar";
import { SearchField } from "@/components/dynamic-core/search-field";
import { Select, SelectItem } from "@/components/dynamic-core/select";
import { Separator } from "@/components/dynamic-core/separator";
import { Slider } from "@/components/dynamic-core/slider";
import { Switch } from "@/components/dynamic-core/switch";
import {
  TableRoot,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
  TableHeader,
} from "@/components/dynamic-core/table";
import { Tabs, Tab, TabList, TabPanel } from "@/components/dynamic-core/tabs";
import { TextField } from "@/components/dynamic-core/text-field";
import { TimeField } from "@/components/dynamic-core/time-field";
import { ToggleButton } from "@/components/dynamic-core/toggle-button";
import { GitHubIcon, TwitterIcon, GoogleIcon } from "@/components/icons";
import { useLocalVariants } from "@/modules/themes/contexts/variants-context";

export function ComponentsOverview({ className }: { className?: string }) {
  const { variants } = useLocalVariants();
  const globalVariant = variants.global;
  return (
    <div className={cn("grid grid-cols-10 gap-8 p-4 sm:p-8", className)}>
      <div className="col-span-10 xl:col-span-6">
        <Slider
          label="Progress"
          showValueLabel
          defaultValue={50}
          variant={globalVariant}
          className="!w-full"
        />
      </div>
      <div className="col-span-3 hidden translate-y-3 justify-end gap-2 xl:col-span-2 xl:flex">
        <Switch>
          <span className="truncate">Focus mode</span>
        </Switch>
        <Avatar
          src="https://github.com/mehdibha.png"
          alt="@mehdibha"
          fallback="M"
        />
      </div>
      <div className="col-span-4 row-span-2 lg:col-span-2">
        <RadioGroup>
          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone (SMS)</Radio>
          <Radio value="notification">
            <span className="truncate">Push notification</span>
          </Radio>
          <Radio value="none">None</Radio>
        </RadioGroup>
      </div>
      <div className="col-span-6 row-span-2 flex flex-col items-end justify-between gap-2 lg:col-span-8 lg:row-span-1 lg:flex-row lg:items-center xl:col-span-5 xl:justify-start">
        <div className="flex items-center gap-2">
          <Button variant={globalVariant}>Button</Button>
          <ToggleButton aria-label="pin" variant={globalVariant}>
            <PinIcon />
          </ToggleButton>
          <MenuRoot>
            <Button shape="square">
              <MenuIcon />
            </Button>
            <Menu>
              <MenuItem>Account settings</MenuItem>
              <MenuItem>Create team</MenuItem>
              <MenuItem>Command menu</MenuItem>
              <MenuItem>Log out</MenuItem>
            </Menu>
          </MenuRoot>
          <Select>
            <SelectItem>Perplexity</SelectItem>
            <SelectItem>Replicate</SelectItem>
            <SelectItem>Together AI</SelectItem>
            <SelectItem>ElevenLabs</SelectItem>
          </Select>
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <Switch>
            <span className="truncate">Focus mode</span>
          </Switch>
          <Avatar
            src="https://github.com/mehdibha.png"
            alt="@mehdibha"
            fallback="M"
          />
        </div>
      </div>
      <div className="col-span-10 flex items-center justify-end gap-2 lg:col-span-8 xl:col-span-3">
        <FileTriggerDemo />
        <ColorPicker defaultValue="#5100FF" />
        <TimeField aria-label="Event time" />
        <DatePicker className="" />
      </div>
      {/* <div className="col-span-3 flex items-center justify-end gap-2">
        <Switch>Focus mode</Switch>
        <Avatar
          src="https://github.com/mehdibha.png"
          alt="@mehdibha"
          fallback="M"
        />
      </div> */}
      {/* <div className="col-span-10 row-span-6 lg:col-span-7">
        <TableRoot
          aria-label="Vocalists"
          selectionMode="multiple"
          variant="bordered"
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn isRowHeader>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Age</TableColumn>
            <TableColumn>Role</TableColumn>
            <TableColumn>Band</TableColumn>
            <TableColumn>Status</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow id={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.age}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.band}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableRoot>
        <DropZone>
          <UploadIcon />
          <DropZoneLabel>Drag and drop files here</DropZoneLabel>
        </DropZone>
        <ProgressBar
          label="Loading..."
          duration="30s"
          variant={globalVariant}
          className="w-full"
        />
        <BadgeVariants />
      </div> */}
    </div>
  );
}

export const MobileComponentsOverview = ({
  className,
}: {
  className?: string;
}) => {
  const { variants } = useLocalVariants();
  const globalVariant = variants.global;
  return (
    <div className={cn("grid grid-cols-10 gap-3 p-4", className)}>
      <div className="col-span-10">
        <Slider
          label="Progress"
          showValueLabel
          defaultValue={50}
          variant={globalVariant}
          className="!w-full"
        />
      </div>
      <div className="min-[35rem]:col-span-3 col-span-10 row-span-2 flex justify-between">
        <RadioGroup>
          <Radio value="email">
            <span className="truncate">Email</span>
          </Radio>
          <Radio value="phone">
            <span className="truncate">Phone (SMS)</span>
          </Radio>
          <Radio value="notification">
            <span className="truncate">Push notification</span>
          </Radio>
          <Radio value="none" className="min-[35rem]:flex hidden">
            None
          </Radio>
        </RadioGroup>
        <div className="min-[35rem]:hidden flex flex-col items-end gap-3">
          <Switch>
            <span className="truncate">Focus mode</span>
          </Switch>
          <Avatar
            src="https://github.com/mehdibha.png"
            alt="@mehdibha"
            fallback="M"
          />
        </div>
      </div>
      <div className="min-[35rem]:col-span-7 col-span-10 flex flex-wrap items-center justify-end gap-3">
        <Button variant={globalVariant}>Button</Button>
        <ToggleButton aria-label="pin" variant={globalVariant}>
          <PinIcon />
        </ToggleButton>
        <span className="flex-1" />
        <MenuRoot>
          <Button shape="square">
            <MenuIcon />
          </Button>
          <Menu>
            <MenuItem>Account settings</MenuItem>
            <MenuItem>Create team</MenuItem>
            <MenuItem>Command menu</MenuItem>
            <MenuItem>Log out</MenuItem>
          </Menu>
        </MenuRoot>
        <Select className="xs:flex-auto flex-1">
          <SelectItem>Perplexity</SelectItem>
          <SelectItem>Replicate</SelectItem>
          <SelectItem>Together AI</SelectItem>
          <SelectItem>ElevenLabs</SelectItem>
        </Select>
      </div>
      <div className="min-[35rem]:flex col-span-7 hidden items-center justify-end gap-3">
        <Avatar
          src="https://github.com/mehdibha.png"
          alt="@mehdibha"
          fallback="M"
        />
        <Switch>
          <span className="truncate">Focus mode</span>
        </Switch>
      </div>
      <div className="col-span-10">
        <DatePicker className="w-full" />
      </div>
      <div className="col-span-10 flex flex-wrap items-center gap-3">
        <FileTriggerDemo />
        <ColorPicker defaultValue="#5100FF" className="flex-1" />
        <TimeField aria-label="Event time" className="flex-1" />
      </div>
      {/* <div className="col-span-5 flex justify-end">
      </div> */}
      {/* TODO */}
    </div>
  );
};

function Login() {
  const { variants } = useLocalVariants();
  const globalVariant = variants.global;
  return (
    <div className="bg-bg-muted w-full rounded-lg border p-8">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Login
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Enter your email below to login to your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign in with github"
        >
          <GitHubIcon />
        </Button>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-muted text-fg-muted px-2">Or</span>
        </div>
      </div>
      <TextField label="Email address" type="email" className="w-full" />
      <Button variant={globalVariant} className="mt-4 w-full" type="submit">
        Continue with email
      </Button>
      <p className="text-fg-muted mt-4 text-sm">
        Don&apos;t have an account?{" "}
        <Link variant="quiet" href="/preview/register">
          Register
        </Link>
      </p>
    </div>
  );
}

function Register() {
  const { variants } = useLocalVariants();
  const globalVariant = variants.global;
  return (
    <div className="bg-bg-muted w-full rounded-lg border p-8">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Create an account
      </h1>
      <p className="text-fg-muted mt-2 text-sm">
        Enter your email below to create your account
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Button
          href="/preview/overview"
          variant="outline"
          className="flex-1"
          aria-label="Sign up with google"
        >
          <GoogleIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign up with X"
        >
          <TwitterIcon />
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          aria-label="Sign up with github"
        >
          <GitHubIcon />
        </Button>
      </div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-bg-muted text-fg-muted px-2">Or</span>
        </div>
      </div>
      <TextField label="Email address" className="w-full" />
      <Button variant={globalVariant} className="mt-4 w-full">
        Sign up with email
      </Button>
      <p className="text-fg-muted mt-4 text-sm">
        Already have an account?{" "}
        <Link variant="quiet" href="/preview/login">
          Login
        </Link>
      </p>
    </div>
  );
}

const items = [
  {
    id: 1,
    name: "Randy Blythe",
    email: "randy.blythe@example.com",
    age: 52,
    role: "Vocalist",
    band: "Lamb of God",
    status: "Active",
  },
  {
    id: 2,
    name: "Phil Anselmo",
    email: "phil.anselmo@example.com",
    age: 55,
    role: "Vocalist",
    band: "Pantera",
    status: "Active",
  },
  {
    id: 3,
    name: "George Fisher",
    email: "george.fisher@example.com",
    age: 53,
    role: "Vocalist",
    band: "Cannibal Corpse",
    status: "Active",
  },
  {
    id: 4,
    name: "Corey Taylor",
    email: "corey.taylor@example.com",
    age: 50,
    role: "Vocalist",
    band: "Slipknot",
    status: "Active",
  },
  {
    id: 5,
    name: "Trevor Strnad",
    email: "trevor.strnad@example.com",
    age: 41,
    role: "Vocalist",
    band: "The Black Dahlia Murder",
    status: "Inactive",
  },
  {
    id: 6,
    name: "Chuck Schuldiner",
    email: "chuck.schuldiner@example.com",
    age: 34,
    role: "Vocalist",
    band: "Death",
    status: "Deceased",
  },
  {
    id: 7,
    name: "Mitch Lucker",
    email: "mitch.lucker@example.com",
    age: 28,
    role: "Vocalist",
    band: "Suicide Silence",
    status: "Deceased",
  },
];

"use client";

import { MenuIcon, PinIcon } from "lucide-react";

import { Alert } from "@dotui/ui/components/alert";
import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import { RangeCalendar } from "@dotui/ui/components/calendar";
import { Checkbox } from "@dotui/ui/components/checkbox";
import { ColorPicker } from "@dotui/ui/components/color-picker";
import { ColorSlider } from "@dotui/ui/components/color-slider";
import { Combobox, ComboboxItem } from "@dotui/ui/components/combobox";
import { DatePicker } from "@dotui/ui/components/date-picker";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Menu, MenuItem, MenuRoot } from "@dotui/ui/components/menu";
import { NumberField } from "@dotui/ui/components/number-field";
import { ProgressBar } from "@dotui/ui/components/progress-bar";
import { Radio, RadioGroup } from "@dotui/ui/components/radio-group";
import { SearchField } from "@dotui/ui/components/search-field";
import { Select, SelectItem } from "@dotui/ui/components/select";
import { Separator } from "@dotui/ui/components/separator";
import { Slider } from "@dotui/ui/components/slider";
import { Switch } from "@dotui/ui/components/switch";
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRoot,
  TableRow,
} from "@dotui/ui/components/table";
import { Tab, TabList, TabPanel, Tabs } from "@dotui/ui/components/tabs";
import { TextField } from "@dotui/ui/components/text-field";
import { TimeField } from "@dotui/ui/components/time-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { cn } from "@dotui/ui/lib/utils";

import { GitHubIcon, GoogleIcon, TwitterIcon } from "@/components/icons";
import { Link } from "@/components/link";

export function ComponentsOverview({ className }: { className?: string }) {
  const defaultColorScheme = "primary";

  return (
    <div className={cn("grid grid-cols-10 gap-8 p-4 sm:p-8", className)}>
      <div className="col-span-10 xl:col-span-6">
        <Slider
          label="Progress"
          showValueLabel
          defaultValue={50}
          variant={defaultColorScheme}
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
          <Button variant={defaultColorScheme}>Button</Button>
          <ToggleButton aria-label="pin" variant={defaultColorScheme}>
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
        {/* <FileTriggerDemo /> */}
        <ColorPicker defaultValue="#5100FF" />
        <TimeField aria-label="Event time" />
        <DatePicker className="" />
      </div>
      <div className="col-span-5 flex flex-col gap-4 md:col-span-4 md:row-span-6 lg:col-span-3 lg:row-span-8">
        <Alert title="Payment Information" className="hidden md:flex">
          Enter your payment method to complete your purchase.
        </Alert>
        <Tabs color={defaultColorScheme}>
          <TabList>
            <Tab id="login" className="w-1/2">
              Login
            </Tab>
            <Tab id="register" className="w-1/2">
              Register
            </Tab>
          </TabList>
          <TabPanel id="login" className="mt-4">
            <Login />
          </TabPanel>
          <TabPanel id="register" className="mt-4">
            <Register />
          </TabPanel>
        </Tabs>
        {/* <ColorSlider
          label="Opacity"
          defaultValue="hsla(210, 64%, 35%, 0.7)"
          channel="alpha"
          className="hidden !w-full md:flex"
        /> */}
        <ProgressBar
          label="Loading..."
          value={75}
          variant={defaultColorScheme}
          className="hidden w-full lg:flex"
        />
      </div>
      <div className="col-span-5 flex flex-col gap-4 md:col-span-6 md:row-span-3 lg:col-span-2">
        <Alert title="Payment Information" className="md:hidden">
          Enter your payment method to complete your purchase.
        </Alert>
        <Checkbox defaultSelected variant={defaultColorScheme}>
          {" "}
          Notifications
        </Checkbox>
        <SearchField aria-label="Search" className="w-full" />
        <Combobox
          label="Country"
          description="Please select a country."
          className="w-full"
        >
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Spain</ComboboxItem>
          <ComboboxItem>Tunisia</ComboboxItem>
          <ComboboxItem>United states</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
        </Combobox>
        <NumberField label="Width" defaultValue={1024} className="w-full" />
        <ColorSlider
          label="Opacity"
          defaultValue="hsla(210, 64%, 35%, 0.7)"
          channel="alpha"
          className="!w-full md:hidden"
        />
        <ProgressBar
          label="Loading..."
          value={75}
          variant={defaultColorScheme}
          className="w-full lg:hidden"
        />
      </div>
      <div className="col-span-10 flex justify-between gap-8 md:col-span-6 lg:col-span-5 lg:row-span-3">
        <ListBox className="max-h-none w-full">
          <ListBoxItem>New...</ListBoxItem>
          <ListBoxItem>Badges</ListBoxItem>
          <Separator />
          <ListBoxItem>Save</ListBoxItem>
          <ListBoxItem>Save as...</ListBoxItem>
          <ListBoxItem>Rename...</ListBoxItem>
          <Separator />
          <ListBoxItem>Page setup…</ListBoxItem>
          <ListBoxItem>Print…</ListBoxItem>
        </ListBox>
        <RangeCalendar />
      </div>
      <div className="col-span-10 row-span-6 lg:col-span-7">
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
      </div>
    </div>
  );
}

export const MobileComponentsOverview = ({
  className,
}: {
  className?: string;
}) => {
  const defaultColorScheme = "primary";

  return (
    <div className={cn("grid grid-cols-10 gap-3 p-4", className)}>
      <div className="col-span-10">
        <Slider
          label="Progress"
          showValueLabel
          defaultValue={50}
          variant={defaultColorScheme}
          className="!w-full"
        />
      </div>
      <div className="col-span-10 row-span-2 flex justify-between min-[560px]:col-span-3">
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
          <Radio value="none" className="hidden min-[560px]:flex">
            None
          </Radio>
        </RadioGroup>
        <div className="flex flex-col items-end gap-3 min-[560px]:hidden">
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
      <div className="col-span-10 flex flex-wrap items-center justify-end gap-3 min-[560px]:col-span-7">
        <Button variant={defaultColorScheme}>Button</Button>
        <ToggleButton aria-label="pin" variant={defaultColorScheme}>
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
        <Select className="flex-1 xs:flex-auto">
          <SelectItem>Perplexity</SelectItem>
          <SelectItem>Replicate</SelectItem>
          <SelectItem>Together AI</SelectItem>
          <SelectItem>ElevenLabs</SelectItem>
        </Select>
      </div>
      <div className="col-span-7 hidden items-center justify-end gap-3 min-[560px]:flex">
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
        {/* <FileTriggerDemo /> */}
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
  const defaultColorScheme = "primary";

  return (
    <div className="w-full rounded-lg border bg-bg-muted p-8">
      <h1 className="text-2xl leading-none font-semibold tracking-tight">
        Login
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
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
          <span className="bg-bg-muted px-2 text-fg-muted">Or</span>
        </div>
      </div>
      <TextField label="Email address" type="email" className="w-full" />
      <Button
        variant={defaultColorScheme}
        className="mt-4 w-full"
        type="submit"
      >
        Continue with email
      </Button>
      <p className="mt-4 text-sm text-fg-muted">
        Don&apos;t have an account?{" "}
        <Link variant="quiet" href="/preview/register">
          Register
        </Link>
      </p>
    </div>
  );
}

function Register() {
  const defaultColorScheme = "primary";

  return (
    <div className="w-full rounded-lg border bg-bg-muted p-8">
      <h1 className="text-2xl leading-none font-semibold tracking-tight">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
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
          <span className="bg-bg-muted px-2 text-fg-muted">Or</span>
        </div>
      </div>
      <TextField label="Email address" className="w-full" />
      <Button variant={defaultColorScheme} className="mt-4 w-full">
        Sign up with email
      </Button>
      <p className="mt-4 text-sm text-fg-muted">
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

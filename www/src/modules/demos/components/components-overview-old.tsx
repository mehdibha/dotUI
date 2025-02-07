"use client";

import { PinIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/core/link";
import { RadioGroup, Radio } from "@/components/core/radio-group";
import FileTriggerDemo from "@/components/demos/file-trigger/default";
import { Alert } from "@/components/dynamic-core/alert";
import { Avatar } from "@/components/dynamic-core/avatar";
import { Button } from "@/components/dynamic-core/button";
import { RangeCalendar } from "@/components/dynamic-core/calendar";
import { Checkbox } from "@/components/dynamic-core/checkbox";
import { ColorSlider } from "@/components/dynamic-core/color-slider";
import { Combobox, ComboboxItem } from "@/components/dynamic-core/combobox";
import { DateRangePicker } from "@/components/dynamic-core/date-range-picker";
import { ListBox, ListBoxItem } from "@/components/dynamic-core/list-box";
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
import { GitHubIcon, TwitterIcon, GoogleIcon } from "@/components/icons";
import { useLocalVariants } from "@/modules/themes/contexts/variants-context";

export function ComponentsOverview({ className }: { className?: string }) {
  const { variants } = useLocalVariants();
  const globalVariant = variants.global;
  return (
    <div className={cn("container grid grid-cols-10 gap-8 p-8", className)}>
      <div className="col-span-8">
        <Slider
          label="Progress"
          showValueLabel
          defaultValue={50}
          variant={globalVariant}
          className="!w-full"
        />
      </div>
      <div className="col-span-2 row-span-2">
        <RadioGroup>
          <Radio value="email">Email</Radio>
          <Radio value="phone">Phone (SMS)</Radio>
          <Radio value="notification">
            <span className="truncate">Push notification</span>
          </Radio>
        </RadioGroup>
      </div>
      <div className="col-span-8 flex items-center justify-between gap-4">
        <Button variant={globalVariant}>Button</Button>
        <Select>
          <SelectItem>Perplexity</SelectItem>
          <SelectItem>Replicate</SelectItem>
          <SelectItem>Together AI</SelectItem>
          <SelectItem>ElevenLabs</SelectItem>
        </Select>
        <FileTriggerDemo />
        <div className="flex-1" />
        <Switch>Focus mode</Switch>
        <Avatar
          src="https://github.com/mehdibha.png"
          alt="@mehdibha"
          fallback="M"
        />
        <DateRangePicker className="hidden xl:block" />
      </div>
      <div className="col-span-6 flex flex-col gap-4 lg:col-span-3 lg:row-span-8">
        <Alert title="Payment Information">
          Enter your payment method to complete your purchase.
        </Alert>
        <Tabs>
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
        <ColorSlider
          label="Opacity"
          defaultValue="hsla(210, 64%, 35%, 0.7)"
          channel="alpha"
          className="hidden !w-full lg:block"
        />
        <ProgressBar
          label="Loading..."
          value={75}
          variant={globalVariant}
          className="w-full"
        />
      </div>
      <div className="col-span-4 flex justify-between gap-6 lg:col-span-5 lg:row-span-2">
        <ListBox className="hidden max-h-none w-full lg:flex">
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
        <div className="w-full lg:hidden" />
        <div className="space-y-4">
          <DateRangePicker className="block lg:hidden" />
          <RangeCalendar />
          <Checkbox defaultSelected className="flex w-full lg:hidden">
            Notifications
          </Checkbox>
          <SearchField aria-label="Search" className="block w-full lg:hidden" />
          <Combobox
            label="Country"
            description="Please select a country."
            className="block w-full lg:hidden"
          >
            <ComboboxItem>Canada</ComboboxItem>
            <ComboboxItem>France</ComboboxItem>
            <ComboboxItem>Germany</ComboboxItem>
            <ComboboxItem>Spain</ComboboxItem>
            <ComboboxItem>Tunisia</ComboboxItem>
            <ComboboxItem>United states</ComboboxItem>
            <ComboboxItem>United Kingdom</ComboboxItem>
          </Combobox>
          <NumberField
            label="Width"
            defaultValue={1024}
            className="block w-full lg:hidden"
          />
        </div>
      </div>
      <div className="col-span-2 row-span-2 hidden flex-col gap-4 lg:flex">
        <Checkbox defaultSelected>Notifications</Checkbox>
        <SearchField aria-label="Search" className="w-auto" />
        <Combobox
          label="Country"
          description="Please select a country."
          className="w-auto"
        >
          <ComboboxItem>Canada</ComboboxItem>
          <ComboboxItem>France</ComboboxItem>
          <ComboboxItem>Germany</ComboboxItem>
          <ComboboxItem>Spain</ComboboxItem>
          <ComboboxItem>Tunisia</ComboboxItem>
          <ComboboxItem>United states</ComboboxItem>
          <ComboboxItem>United Kingdom</ComboboxItem>
        </Combobox>
        <NumberField label="Width" defaultValue={1024} className="w-auto" />
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
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <Slider
        label="Progress"
        showValueLabel
        defaultValue={50}
        className="w-full"
      />
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

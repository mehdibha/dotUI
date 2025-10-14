"use client";

import {
  CalendarIcon,
  CogIcon,
  CopyIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@dotui/registry-v2/ui/button";
import { Command } from "@dotui/registry-v2/ui/command";
import { Dialog } from "@dotui/registry-v2/ui/dialog";
import { Label } from "@dotui/registry-v2/ui/field";
import { Kbd } from "@dotui/registry-v2/ui/kbd";
import { Select } from "@dotui/registry-v2/ui/select";
import { TagGroup } from "@dotui/registry-v2/ui/tag-group";

export function CommandDemo() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8 text-fg-muted">
      {/* <CommandExample className="w-[480px]" /> */}

      <div className="flex items-center gap-2">
        <Dialog>
          <Button>Popover</Button>
          <Dialog.Popover placement="bottom left">
            <Dialog.Content className="!p-0">
              {/* <CommandExample /> */}
            </Dialog.Content>
          </Dialog.Popover>
        </Dialog>

        <Dialog>
          <Button>Modal</Button>
          <Dialog.Modal>
            {/* <CommandExample /> */}
          </Dialog.Modal>
        </Dialog>

        <Dialog>
          <Button>Drawer</Button>
          <Dialog.Drawer>
            {/* <CommandExample /> */}
          </Dialog.Drawer>
        </Dialog>

        <Dialog>
          <Button>Responsive</Button>
          <Dialog.Overlay>
            {/* <CommandExample /> */}
          </Dialog.Overlay>
        </Dialog>
      </div>

      <Select defaultValue={"tn"}>
        <Label>Select country</Label>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popover>
          <Command>
            <Command.SearchField placeholder="Search country..." />
            <Select.List className="max-h-72 overflow-y-auto">
              <Select.Item id="tn">Tunisia</Select.Item>
              <Select.Item id="us">United States</Select.Item>
              <Select.Item id="uk">United Kingdom</Select.Item>
              <Select.Item id="ca">Canada</Select.Item>
              <Select.Item id="de">Germany</Select.Item>
              <Select.Item id="fr">France</Select.Item>
              <Select.Item id="it">Italy</Select.Item>
              <Select.Item id="jp">Japan</Select.Item>
              <Select.Item id="kr">Korea</Select.Item>
              <Select.Item id="mx">Mexico</Select.Item>
              <Select.Item id="nz">New Zealand</Select.Item>
              <Select.Item id="ru">Russia</Select.Item>
              <Select.Item id="sa">Saudi Arabia</Select.Item>
              <Select.Item id="sg">Singapore</Select.Item>
              <Select.Item id="za">South Africa</Select.Item>
              <Select.Item id="tw">Taiwan</Select.Item>
              <Select.Item id="th">Thailand</Select.Item>
              <Select.Item id="tr">Turkey</Select.Item>
              <Select.Item id="ua">Ukraine</Select.Item>
              <Select.Item id="vn">Vietnam</Select.Item>
            </Select.List>
          </Command>
        </Select.Popover>
      </Select>
    </div>
  );
}

// const CommandExample = ({ className }: { className?: string }) => {
//   return (
//     <Command className={className}>
//       <Command.SearchField placeholder="Type a command or search..." />
//       <Command.List>
//         <Command.Section>
//           <Command.SectionTitle>Navigation</Command.SectionTitle>
//           <Command.Item prefix={<HomeIcon />}>Home</Command.Item>
//           <Command.Item prefix={<CalendarIcon />}>Calendar</Command.Item>
//           <Command.Item prefix={<MailIcon />}>Messages</Command.Item>
//         </Command.Section>

//         <Command.Section>
//           <Command.SectionTitle>Actions</Command.SectionTitle>
//           <Command.Item prefix={<FileTextIcon />} suffix={<Kbd>⌘ N</Kbd>}>
//             New Document
//           </Command.Item>
//           <Command.Item prefix={<CopyIcon />} suffix={<Kbd>⌘ ⇧ C</Kbd>}>
//             Copy Link
//           </Command.Item>
//           <Command.Item prefix={<UsersIcon />}>
//             Invite Team Members
//           </Command.Item>
//         </Command.Section>

//         <Command.Section>
//           <Command.SectionTitle>Settings</Command.SectionTitle>
//           <Command.Item prefix={<UserIcon />}>Profile Settings</Command.Item>
//           <Command.Item prefix={<CogIcon />} suffix={<Kbd>⌘ ,</Kbd>}>
//             Preferences
//           </Command.Item>
//           <Command.Item prefix={<SunIcon />}>Toggle Light Mode</Command.Item>
//           <Command.Item prefix={<MoonIcon />}>Toggle Dark Mode</Command.Item>
//         </Command.Section>

//         <Command.Section>
//           <Command.SectionTitle>Account</Command.SectionTitle>
//           <Command.Item prefix={<LogOutIcon />}>Log Out</Command.Item>
//         </Command.Section>
//       </Command.List>
//     </Command>
//   );
// };

const countries = [
  { id: "tn", name: "Tunisia" },
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ca", name: "Canada" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "it", name: "Italy" },
  { id: "jp", name: "Japan" },
  { id: "kr", name: "Korea" },
  { id: "mx", name: "Mexico" },
  { id: "nz", name: "New Zealand" },
  { id: "ru", name: "Russia" },
  { id: "sa", name: "Saudi Arabia" },
  { id: "sg", name: "Singapore" },
  { id: "za", name: "South Africa" },
  { id: "tw", name: "Taiwan" },
  { id: "th", name: "Thailand" },
  { id: "tr", name: "Turkey" },
  { id: "ua", name: "Ukraine" },
  { id: "vn", name: "Vietnam" },
];

import React from "react";
import {
  AlignCenterIcon,
  AtSignIcon,
  BarChart4Icon,
  BellIcon,
  BluetoothIcon,
  BoldIcon,
  CodeIcon,
  InboxIcon,
  LinkIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  ScreenShareIcon,
  SmileIcon,
  SparkleIcon,
  SunIcon,
  UserRoundIcon,
  Volume2Icon,
  ZapIcon,
} from "lucide-react";

const icons = [
  CodeIcon,
  BellIcon,
  InboxIcon,
  MoonIcon,
  MailIcon,
  AtSignIcon,
  LinkIcon,
  AlignCenterIcon,
  BoldIcon,
  UserRoundIcon,
  BarChart4Icon,
  BluetoothIcon,
  ZapIcon,
  Volume2Icon,
  SunIcon,
  MoonIcon,
  SparkleIcon,
  SmileIcon,
  ScreenShareIcon,
  PhoneIcon,
];

export const IconsList = ({ limit }: { limit?: number }) => {
  return (
    <>
      {icons.slice(0, limit ?? icons.length).map((Icon, i) => (
        <div
          key={i}
          className="flex h-16 items-center justify-center rounded-md bg-card shadow"
        >
          <Icon size={18} />
        </div>
      ))}
    </>
  );
};

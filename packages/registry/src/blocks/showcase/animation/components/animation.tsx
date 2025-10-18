"use client";

import React from "react";
import {
  BookIcon,
  ChevronRightIcon,
  ContrastIcon,
  LanguagesIcon,
  LogOutIcon,
  SettingsIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Avatar } from "@dotui/registry/ui/avatar";
import { Card, CardContent, CardHeader } from "@dotui/registry/ui/card";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
} from "@dotui/registry/ui/list-box";
import { Select, SelectItem } from "@dotui/registry/ui/select";
import { Separator } from "@dotui/registry/ui/separator";

export function Animation({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-96 w-96">
      <Select
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        defaultValue="perplexity"
      >
        <SelectItem id="perplexity">Perplexity</SelectItem>
        <SelectItem id="replicate">Replicate</SelectItem>
        <SelectItem id="together-ai">Together AI</SelectItem>
        <SelectItem id="elevenlabs">ElevenLabs</SelectItem>
      </Select>
    </div>
  );
}

"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { SelectValue } from "react-aria-components";
import { Button } from "@/lib/components/core/default/button";
import { Select, SelectRoot, SelectItem } from "@/lib/components/core/default/select";
import { useMounted } from "@/lib/hooks/use-mounted";

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!mounted) return null;
  return null
  // return (
  //   <SelectRoot
  //     selectedKey={theme}
  //     onSelectionChange={(key) => setTheme(key as string)}
  //     aria-label="Change Theme"
  //     className={className}
  //   >
  //     <Button>
  //       <SelectValue>
  //         {resolvedTheme === "light" ? (
  //           <SunIcon className="size-5" />
  //         ) : (
  //           <MoonIcon className="size-5" />
  //         )}
  //       </SelectValue>
  //     </Button>
  //     <Overlay>
  //       <SelectContent aria-label="items">
  //         <SelectItem id="system">System</SelectItem>
  //         <SelectItem id="light">Light</SelectItem>
  //         <SelectItem id="dark">Dark</SelectItem>
  //       </SelectContent>
  //     </Overlay>
  //   </SelectRoot>
  // );
};

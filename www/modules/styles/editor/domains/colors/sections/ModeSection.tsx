"use client";

import React from "react";
import { ChevronsUpDownIcon, ContrastIcon, MoonIcon, SunIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { FormControl } from "@dotui/ui/components/form";
import { Label } from "@dotui/ui/components/field";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { SelectRoot, SelectValue } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { ThemeModeSwitch } from "@/components/theme-mode-switch";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";
import { StyleEditorSection } from "@/modules/styles/components/style-editor/section";

export function ModeSection() {
  const { form, resolvedMode, isSuccess } = useStyleForm();
  const { setActiveMode } = usePreferences();

  return (
    <StyleEditorSection title="Mode">
      <div className="mt-2 flex items-start justify-between">
        <Skeleton show={!isSuccess}>
          <FormControl
            control={form.control}
            name="theme.colors.activeModes"
            render={({ value, onChange }) => (
              <SelectRoot
                aria-label="Mode configuration"
                selectedKey={value.join("-")}
                onSelectionChange={(key) => {
                  if (key === "light-dark") {
                    onChange(["light", "dark"]);
                  } else if (key === "light") {
                    onChange(["light"]);
                  } else if (key === "dark") {
                    onChange(["dark"]);
                  }
                }}
              >
                <Button suffix={<ChevronsUpDownIcon />}>
                  <SelectValue />
                </Button>
                <Popover>
                  <ListBox>
                    <ListBoxItem id="light-dark" prefix={<ContrastIcon />}>
                      light/dark
                    </ListBoxItem>
                    <ListBoxItem id="light" prefix={<SunIcon />}>
                      light only
                    </ListBoxItem>
                    <ListBoxItem id="dark" prefix={<MoonIcon />}>
                      dark only
                    </ListBoxItem>
                  </ListBox>
                </Popover>
              </SelectRoot>
            )}
          />
        </Skeleton>
        <Skeleton show={!isSuccess}>
          {form.watch("theme.colors.activeModes").join("-") === "light-dark" && (
            <ThemeModeSwitch
              isSelected={resolvedMode === "light"}
              onChange={(isSelected) => {
                setActiveMode(isSelected ? "light" : "dark");
              }}
            />
          )}
        </Skeleton>
      </div>
    </StyleEditorSection>
  );
}


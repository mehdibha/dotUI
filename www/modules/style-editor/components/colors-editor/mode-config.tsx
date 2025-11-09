import { ContrastIcon, MoonIcon, SunIcon } from "lucide-react";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const ModeConfig = () => {
  const form = useStyleEditorForm();
  const { saveDraft } = useDraftStyle();

  return (
    <form.AppField
      name="theme.colors.activeModes"
      listeners={{
        onChange: () => {
          saveDraft();
        },
        onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
      }}
    >
      {(field) => (
        <field.Select
          aria-label="Supported modes"
          value={field.state.value.join("-")}
          onChange={(key) =>
            field.handleChange(
              key?.toString().split("-") as ("light" | "dark")[],
            )
          }
          className="w-auto"
        >
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="light">
              <SunIcon />
              Light only
            </SelectItem>
            <SelectItem id="dark">
              <MoonIcon />
              Dark only
            </SelectItem>
            <SelectItem id="light-dark">
              <ContrastIcon />
              Light/Dark
            </SelectItem>
          </SelectContent>
        </field.Select>
      )}
    </form.AppField>
  );
};

export const ModeSwitch = () => {
  const { activeMode, setActiveMode } = usePreferences();
  const { supportsLightDark } = useResolvedModeState();

  if (!supportsLightDark) {
    return null;
  }

  return (
    <ThemeModeSwitch
      isSelected={activeMode === "light"}
      onChange={(isSelected) => {
        setActiveMode(isSelected ? "light" : "dark");
      }}
    />
  );
};

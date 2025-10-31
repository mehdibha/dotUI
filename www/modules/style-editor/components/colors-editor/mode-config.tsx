import { ContrastIcon, MoonIcon, SunIcon } from "lucide-react";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@dotui/registry/ui/select";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { useResolvedModeState } from "@/modules/style-editor/hooks/use-resolved-mode";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";

export const ModeConfig = () => {
  const { isPending } = useEditorStyle();
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
        <Skeleton show={isPending}>
          <field.Select
            aria-label="Active modes"
            selectedKey={field.state.value.join("-")}
            onSelectionChange={(key) =>
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
        </Skeleton>
      )}
    </form.AppField>
  );
};

export const ModeSwitch = () => {
  const { isPending } = useEditorStyle();
  const { activeMode, setActiveMode } = usePreferences();
  const { supportsLightDark } = useResolvedModeState();

  if (!supportsLightDark) {
    return null;
  }

  return (
    <Skeleton show={isPending}>
      <ThemeModeSwitch
        isSelected={activeMode === "light"}
        onChange={(isSelected) => {
          setActiveMode(isSelected ? "light" : "dark");
        }}
      />
    </Skeleton>
  );
};

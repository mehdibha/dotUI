import { ContrastIcon, MoonIcon, SunIcon } from "lucide-react";

import { SelectItem } from "@dotui/ui/components/select";
import { Skeleton } from "@dotui/ui/components/skeleton";

import { ThemeModeSwitch } from "@/components/ui/theme-mode-switch";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";
import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useResolvedModeState } from "../../hooks/use-resolved-mode";

export const ModeConfig = () => {
  const { isSuccess } = useEditorStyle();
  const form = useStyleEditorForm();

  return (
    <form.AppField name="theme.colors.activeModes">
      {(field) => (
        <Skeleton show={!isSuccess}>
          <field.Select
            aria-label="Active modes"
            selectedKey={field.state.value.join("-")}
            onSelectionChange={(key) =>
              field.handleChange(
                key?.toString().split("-") as ("light" | "dark")[],
              )
            }
            renderValue={({ defaultChildren }) => defaultChildren}
            className="w-auto"
          >
            <SelectItem id="light" prefix={<SunIcon />}>
              Light only
            </SelectItem>
            <SelectItem id="dark" prefix={<MoonIcon />}>
              Dark only
            </SelectItem>
            <SelectItem id="light-dark" prefix={<ContrastIcon />}>
              Light/Dark
            </SelectItem>
          </field.Select>
        </Skeleton>
      )}
    </form.AppField>
  );
};

export const ModeSwitch = () => {
  const { isSuccess } = useEditorStyle();
  const { activeMode, setActiveMode } = usePreferences();
  const { supportsLightDark } = useResolvedModeState();

  if (!supportsLightDark) {
    return null;
  }

  return (
    <Skeleton show={!isSuccess}>
      <ThemeModeSwitch
        isSelected={activeMode === "light"}
        onChange={(isSelected) => {
          setActiveMode(isSelected ? "light" : "dark");
        }}
      />
    </Skeleton>
  );
};

import { useStore } from "@tanstack/react-form";

import { StyleProvider } from "@dotui/ui";
import type { StyleProviderProps } from "@dotui/ui/helpers/style-provider";

import { usePreferences } from "@/modules/styles/atoms/preferences-atom";
import { useStyleEditorForm } from "../context/style-editor-provider";

export function DraftStyleProvider(
  props: Omit<StyleProviderProps, "style" | "mode">,
) {
  const form = useStyleEditorForm();
  const { activeMode } = usePreferences();

  const [theme, variants, icons] = useStore(form.store, (state) => [
    state.values.theme,
    state.values.variants,
    state.values.icons,
  ]);

  return (
    <StyleProvider
      {...props}
      mode={activeMode}
      style={{
        theme,
        variants,
        icons,
      }}
    />
  );
}

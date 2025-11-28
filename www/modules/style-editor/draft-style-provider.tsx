import { useStore } from "@tanstack/react-form";

import { StyleProvider } from "@dotui/registry";
import type { StyleProviderProps } from "@dotui/registry";

import { usePreferences } from "@/modules/preferences/preferences-atom";

import { useStyleEditorForm } from "./style-editor-provider";

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

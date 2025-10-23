import { cn } from "@dotui/registry/lib/utils";

import { useDraftStyle } from "@/modules/style-editor/atoms/draft-style-atom";
import { ON_CHANGE_DEBOUNCE_MS } from "@/modules/style-editor/constants";
import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

const ACCENT_LEVEL_TOKEN_OVERRIDES: Record<number, Record<string, string>> = {
  0: {
    "color-primary": "var(--neutral-900)",
    "color-primary-hover": "var(--neutral-800)",
    "color-primary-active": "var(--neutral-700)",
    "color-primary-muted": "var(--neutral-100)",
    "color-fg-on-primary": "var(--on-neutral-900)",
  },
  1: {
    "color-primary": "var(--neutral-900)",
    "color-primary-hover": "var(--neutral-800)",
    "color-primary-active": "var(--neutral-700)",
    "color-primary-muted": "var(--neutral-100)",
    "color-fg-on-primary": "var(--on-neutral-900)",
  },
  2: {
    "color-primary": "var(--accent-500)",
    "color-primary-hover": "var(--accent-600)",
    "color-primary-active": "var(--accent-700)",
    "color-primary-muted": "var(--accent-200)",
    "color-fg-on-primary": "var(--on-accent-500)",
  },
  3: {
    "color-primary": "var(--accent-500)",
    "color-primary-hover": "var(--accent-600)",
    "color-primary-active": "var(--accent-700)",
    "color-primary-muted": "var(--accent-200)",
    "color-fg-on-primary": "var(--on-accent-500)",
  },
};

export const AccentEmphasisEditor = () => {
  const { isPending } = useEditorStyle();
  const form = useStyleEditorForm();
  const { saveDraft } = useDraftStyle();

  const applyAccentLevel = (level: number) => {
    const overrides = ACCENT_LEVEL_TOKEN_OVERRIDES[level];

    if (!overrides) return;

    for (const token in overrides) {
      if (!overrides[token]) return;
      form.setFieldValue(
        `theme.colors.tokens.${token}.value`,
        overrides[token] as any,
      );
    }
  };

  return (
    <form.AppField
      name="theme.colors.accentEmphasisLevel"
      listeners={{
        onChange: ({ value }) => {
          applyAccentLevel(value);
          saveDraft();
        },
        onChangeDebounceMs: ON_CHANGE_DEBOUNCE_MS,
      }}
    >
      {(field) => (
        <field.Slider
          label="Accent emphasis"
          minValue={0}
          maxValue={3}
          step={1}
          className={cn(
            "w-full",
            isPending &&
              "**:data-[slot='slider-filler']:opacity-0 **:data-[slot='slider-thumb']:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
          )}
        />
      )}
    </form.AppField>
  );
};

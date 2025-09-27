import { cn } from "@dotui/ui/lib/utils";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

const ACCENT_LEVEL_TOKEN_OVERRIDES: Record<
  0 | 1 | 2 | 3,
  Record<string, string>
> = {
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

  const applyAccentLevel = (level: 0 | 1 | 2 | 3) => {
    const overrides = ACCENT_LEVEL_TOKEN_OVERRIDES[level];

    for (const token in overrides) {
      if (!overrides[token]) return;
      form.setFieldValue(
        `theme.colors.tokens.${token}.value`,
        overrides[token],
      );
    }
  };

  return (
    <form.AppField
      name="theme.colors.accentEmphasisLevel"
      listeners={{
        onChange: (value) => {
          applyAccentLevel(value as unknown as 0 | 1 | 2 | 3);
        },
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
              "[&_[data-slot='slider-filler']]:opacity-0 [&_[data-slot='slider-thumb']]:opacity-0 [&_[data-slot='slider-track']]:animate-pulse [&_[data-slot='slider-value-label']]:opacity-0",
          )}
        />
      )}
    </form.AppField>
  );
};

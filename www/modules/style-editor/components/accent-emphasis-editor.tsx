import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleEditorForm } from "@/modules/style-editor/context/style-editor-provider";
import { useEditorStyle } from "@/modules/style-editor/hooks/use-editor-style";

const ACCENT_LEVEL_TOKEN_OVERRIDES: Record<
  0 | 1 | 2 | 3,
  Record<string, string>
> = {
  0: {
    "color-bg-primary": "var(--neutral-900)",
    "color-bg-primary-hover": "var(--neutral-800)",
    "color-bg-primary-active": "var(--neutral-700)",
    "color-bg-primary-muted": "var(--neutral-100)",
    "color-fg-on-primary": "var(--on-neutral-900)",
  },
  1: {
    "color-bg-primary": "var(--neutral-900)",
    "color-bg-primary-hover": "var(--neutral-800)",
    "color-bg-primary-active": "var(--neutral-700)",
    "color-bg-primary-muted": "var(--neutral-100)",
    "color-fg-on-primary": "var(--on-neutral-900)",
  },
  2: {
    "color-bg-primary": "var(--accent-500)",
    "color-bg-primary-hover": "var(--accent-600)",
    "color-bg-primary-active": "var(--accent-700)",
    "color-bg-primary-muted": "var(--accent-200)",
    "color-fg-on-primary": "var(--on-accent-500)",
  },
  3: {
    "color-bg-primary": "var(--accent-500)",
    "color-bg-primary-hover": "var(--accent-600)",
    "color-bg-primary-active": "var(--accent-700)",
    "color-bg-primary-muted": "var(--accent-200)",
    "color-fg-on-primary": "var(--on-accent-500)",
  },
};

export const AccentLevelEditor = () => {
  const { isLoading } = useEditorStyle();
  const form = useStyleEditorForm();

  const applyAccentLevel = (level: 0 | 1 | 2 | 3) => {
    const tokens = form.getValues("theme.colors.tokens");
    if (!tokens) return;

    const overrides = ACCENT_LEVEL_TOKEN_OVERRIDES[level] ?? {};
    const updatedTokens = tokens.map((t) => {
      const nextValue = overrides[t.name];
      return nextValue !== undefined ? { ...t, value: nextValue } : t;
    });

    form.setValue("theme.colors.tokens", updatedTokens, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <FormControl
      control={form.control}
      name="theme.colors.accentEmphasisLevel"
      render={({ value, onChange, ...field }) => (
        <Skeleton show={isLoading}>
          <Slider
            value={[typeof value === "number" ? value : 1]}
            onChange={(vals) => {
              const next = (vals as number[])[0] as 0 | 1 | 2 | 3;
              onChange(next);
              applyAccentLevel(next);
            }}
            {...field}
            label="Accent emphasis"
            minValue={0}
            maxValue={3}
            step={1}
            className="w-full"
          />
        </Skeleton>
      )}
    />
  );
};

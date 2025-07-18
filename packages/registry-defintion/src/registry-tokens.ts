export interface Token {
  name: string;
  defaultValue: string;
  description?: string;
  categories?: readonly (
    | "color"
    | "typography"
    | "background"
    | "foreground"
    | "border"
    | "spacing"
    | "radius"
  )[];
}

export const COLOR_TOKENS = [
  {
    name: "color-bg",
    defaultValue: "var(--neutral-50)",
    description: "Primary background color for main content areas",
    categories: ["background"],
  },
  {
    name: "color-bg-muted",
    defaultValue: "var(--neutral-100)",
    description: "Muted background color for secondary content areas",
    categories: ["background"],
  },
  {
    name: "color-bg-inverse",
    defaultValue: "var(--neutral-900)",
    description:
      "Inverse background color for dark themes or contrasting areas",
    categories: ["background"],
  },
  {
    name: "color-bg-disabled",
    defaultValue: "var(--neutral-100)",
    description: "Background color for disabled elements",
    categories: ["background"],
  },

  {
    name: "color-bg-neutral",
    defaultValue: "var(--neutral-100)",
    description: "Neutral background color for buttons and components",
    categories: ["background"],
  },
  {
    name: "color-bg-neutral-hover",
    defaultValue: "var(--neutral-200)",
    description: "Neutral background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-neutral-active",
    defaultValue: "var(--neutral-300)",
    description: "Neutral background color for active/pressed states",
    categories: ["background"],
  },

  {
    name: "color-bg-primary",
    defaultValue: "var(--neutral-900)",
    description: "Primary background color for main actions and emphasis",
    categories: ["background"],
  },
  {
    name: "color-bg-primary-hover",
    defaultValue: "var(--neutral-800)",
    description: "Primary background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-primary-active",
    defaultValue: "var(--neutral-700)",
    description: "Primary background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-primary-muted",
    defaultValue: "var(--neutral-100)",
    description: "Muted primary background color for subtle emphasis",
    categories: ["background"],
  },

  {
    name: "color-bg-success",
    defaultValue: "var(--success-400)",
    description: "Background color for success states and positive actions",
    categories: ["background"],
  },
  {
    name: "color-bg-success-hover",
    defaultValue: "var(--success-500)",
    description: "Success background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-success-active",
    defaultValue: "var(--success-600)",
    description: "Success background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-success-muted",
    defaultValue: "var(--success-100)",
    description: "Muted success background color for subtle positive feedback",
    categories: ["background"],
  },

  {
    name: "color-bg-warning",
    defaultValue: "var(--warning-400)",
    description: "Background color for warning states and cautionary actions",
    categories: ["background"],
  },
  {
    name: "color-bg-warning-hover",
    defaultValue: "var(--warning-500)",
    description: "Warning background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-warning-active",
    defaultValue: "var(--warning-600)",
    description: "Warning background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-warning-muted",
    defaultValue: "var(--warning-100)",
    description:
      "Muted warning background color for subtle cautionary feedback",
    categories: ["background"],
  },

  {
    name: "color-bg-danger",
    defaultValue: "var(--danger-400)",
    description: "Background color for error states and destructive actions",
    categories: ["background"],
  },
  {
    name: "color-bg-danger-hover",
    defaultValue: "var(--danger-500)",
    description: "Danger background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-danger-active",
    defaultValue: "var(--danger-600)",
    description: "Danger background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-danger-muted",
    defaultValue: "var(--danger-100)",
    description: "Muted danger background color for subtle error feedback",
    categories: ["background"],
  },

  {
    name: "color-bg-info",
    defaultValue: "var(--info-400)",
    description:
      "Background color for informational states and neutral actions",
    categories: ["background"],
  },
  {
    name: "color-bg-info-hover",
    defaultValue: "var(--info-500)",
    description: "Info background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-info-active",
    defaultValue: "var(--info-600)",
    description: "Info background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-info-muted",
    defaultValue: "var(--info-100)",
    description:
      "Muted info background color for subtle informational feedback",
    categories: ["background"],
  },

  {
    name: "color-bg-accent",
    defaultValue: "var(--accent-400)",
    description: "Background color for accent elements and brand emphasis",
    categories: ["background"],
  },
  {
    name: "color-bg-accent-hover",
    defaultValue: "var(--accent-500)",
    description: "Accent background color for hover states",
    categories: ["background"],
  },
  {
    name: "color-bg-accent-active",
    defaultValue: "var(--accent-600)",
    description: "Accent background color for active/pressed states",
    categories: ["background"],
  },
  {
    name: "color-bg-accent-muted",
    defaultValue: "var(--accent-100)",
    description: "Muted accent background color for subtle brand emphasis",
    categories: ["background"],
  },
  {
    name: "color-bg-accent-muted-hover",
    defaultValue: "var(--accent-200)",
    description: "Muted accent background color for hover states",
    categories: ["background"],
  },

  {
    name: "color-fg",
    defaultValue: "var(--neutral-900)",
    description: "Primary text color for main content",
    categories: ["foreground"],
  },
  {
    name: "color-fg-muted",
    defaultValue: "var(--neutral-700)",
    description: "Muted text color for secondary content and descriptions",
    categories: ["foreground"],
  },
  {
    name: "color-fg-inverse",
    defaultValue: "var(--neutral-50)",
    description: "Inverse text color for dark backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-disabled",
    defaultValue: "var(--neutral-400)",
    description: "Text color for disabled elements",
    categories: ["foreground"],
  },
  {
    name: "color-fg-danger",
    defaultValue: "var(--danger-600)",
    description: "Text color for error messages and destructive actions",
    categories: ["foreground"],
  },
  {
    name: "color-fg-warning",
    defaultValue: "var(--warning-600)",
    description: "Text color for warning messages and cautionary content",
    categories: ["foreground"],
  },
  {
    name: "color-fg-success",
    defaultValue: "var(--success-600)",
    description: "Text color for success messages and positive feedback",
    categories: ["foreground"],
  },
  {
    name: "color-fg-info",
    defaultValue: "var(--info-600)",
    description: "Text color for informational messages and neutral content",
    categories: ["foreground"],
  },
  {
    name: "color-fg-accent",
    defaultValue: "var(--accent-600)",
    description: "Text color for accent content and brand elements",
    categories: ["foreground"],
  },

  {
    name: "color-fg-onNeutral",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on neutral backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onPrimary",
    defaultValue: "var(--neutral-50)",
    description: "Text color for content on primary backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onAccent",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on accent backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onSuccess",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on success backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onDanger",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on danger backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onWarning",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on warning backgrounds",
    categories: ["foreground"],
  },
  {
    name: "color-fg-onInfo",
    defaultValue: "var(--neutral-900)",
    description: "Text color for content on info backgrounds",
    categories: ["foreground"],
  },

  {
    name: "color-border",
    defaultValue: "var(--neutral-200)",
    description: "Default border color for components and dividers",
    categories: ["border"],
  },
  {
    name: "color-border-hover",
    defaultValue: "var(--neutral-300)",
    description: "Border color for hover states",
    categories: ["border"],
  },
  {
    name: "color-border-field",
    defaultValue: "var(--neutral-300)",
    description: "Border color for form fields and inputs",
    categories: ["border"],
  },
  {
    name: "color-border-control",
    defaultValue: "var(--neutral-600)",
    description:
      "Border color for control elements like checkboxes and toggles",
    categories: ["border"],
  },
  {
    name: "color-border-disabled",
    defaultValue: "var(--neutral-200)",
    description: "Border color for disabled elements",
    categories: ["border"],
  },
  {
    name: "color-border-focus",
    defaultValue: "var(--accent-400)",
    description:
      "Border color for focused elements and accessibility indicators",
    categories: ["border"],
  },
  {
    name: "color-border-focus-muted",
    defaultValue: "var(--accent-200)",
    description:
      "Muted border color for focused elements and accessibility indicators",
    categories: ["border"],
  },

  {
    name: "color-border-success",
    defaultValue: "var(--success-200)",
    description: "Border color for success states and positive feedback",
    categories: ["border"],
  },
  {
    name: "color-border-accent",
    defaultValue: "var(--accent-200)",
    description: "Border color for accent elements and brand emphasis",
    categories: ["border"],
  },
  {
    name: "color-border-danger",
    defaultValue: "var(--danger-200)",
    description: "Border color for error states and destructive actions",
    categories: ["border"],
  },
  {
    name: "color-border-warning",
    defaultValue: "var(--warning-200)",
    description: "Border color for warning states and cautionary content",
    categories: ["border"],
  },
  {
    name: "color-border-info",
    defaultValue: "var(--info-200)",
    description: "Border color for informational states and neutral content",
    categories: ["border"],
  },
] as const satisfies Token[];

export const RADIUS_TOKENS = [
  {
    name: "radius-xs",
    defaultValue: "calc(0.125rem * var(--radius-factor))",
  },
  {
    name: "radius-sm",
    defaultValue: "calc(0.25rem * var(--radius-factor))",
  },
  {
    name: "radius-md",
    defaultValue: "calc(0.375rem * var(--radius-factor))",
  },
  {
    name: "radius-lg",
    defaultValue: "calc(0.5rem * var(--radius-factor))",
  },
  {
    name: "radius-xl",
    defaultValue: "calc(0.75rem * var(--radius-factor))",
  },
  {
    name: "radius-2xl",
    defaultValue: "calc(1rem * var(--radius-factor))",
  },
  {
    name: "radius-3xl",
    defaultValue: "calc(1.5rem * var(--radius-factor))",
  },
  {
    name: "radius-4xl",
    defaultValue: "calc(2rem * var(--radius-factor))",
  },
] as const satisfies Token[];

export const TYPOGRAPHY_TOKENS = [
  {
    name: "font-body",
    defaultValue: "var(--font-body)",
    description: "Default font family for body text",
    categories: ["typography"],
  },
  {
    name: "font-heading",
    defaultValue: "var(--font-heading)",
    description: "Font family for headings and titles",
    categories: ["typography"],
  },
] as const satisfies Token[];

export const ALL_TOKENS = [
  ...COLOR_TOKENS.map((token) => ({
    ...token,
    categories: ["color", ...token.categories] as const,
  })),
  ...RADIUS_TOKENS.map((token) => ({
    ...token,
    categories: ["radius"] as const,
  })),
  ...TYPOGRAPHY_TOKENS.map((token) => ({
    ...token,
    categories: ["typography", ...token.categories] as const,
  })),
] as const satisfies Token[];

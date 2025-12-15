export interface Token {
  defaultValue: string;
  description?: string;
  categories?: (
    | "color"
    | "typography"
    | "background"
    | "foreground"
    | "border"
    | "spacing"
    | "radius"
  )[];
  scales?: (
    | "neutral"
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | ".."
  )[];
}

export const COLOR_TOKENS: Record<string, Token> = {
  "color-bg": {
    defaultValue: "var(--neutral-50)",
    description: "Primary background color for main content areas",
    categories: ["background"],
    scales: ["neutral", ".."],
  },
  "color-card": {
    defaultValue: "var(--neutral-100)",
    description: "Card background color for main content areas",
    categories: ["background"],
    scales: ["neutral", ".."],
  },
  "color-popover": {
    defaultValue: "var(--neutral-100)",
    description: "Popover background color for main content areas",
    categories: ["background"],
    scales: ["neutral", ".."],
  },
  "color-muted": {
    defaultValue: "var(--neutral-200)",
    description: "Muted background color for secondary content areas",
    categories: ["background"],
    scales: ["neutral", ".."],
  },
  "color-inverse": {
    defaultValue: "var(--neutral-950)",
    description:
      "Inverse background color for dark themes or contrasting areas",
    categories: ["background"],
    scales: ["neutral", ".."],
  },
  "color-disabled": {
    defaultValue: "var(--neutral-200)",
    description: "Background color for disabled elements",
    categories: ["background"],
    scales: ["neutral", ".."],
  },

  "color-neutral": {
    defaultValue: "var(--neutral-200)",
    description: "Neutral background color for buttons and components",
    categories: ["background"],
    scales: ["neutral"],
  },
  "color-neutral-hover": {
    defaultValue: "var(--neutral-300)",
    description: "Neutral background color for hover states",
    categories: ["background"],
    scales: ["neutral"],
  },
  "color-neutral-active": {
    defaultValue: "var(--neutral-400)",
    description: "Neutral background color for active/pressed states",
    categories: ["background"],
    scales: ["neutral"],
  },

  "color-primary": {
    defaultValue: "var(--neutral-950)",
    description: "Primary background color for main actions and emphasis",
    categories: ["background"],
    scales: ["neutral", "accent", ".."],
  },
  "color-primary-hover": {
    defaultValue: "var(--neutral-900)",
    description: "Primary background color for hover states",
    categories: ["background"],
    scales: ["neutral", "accent", ".."],
  },
  "color-primary-active": {
    defaultValue: "var(--neutral-800)",
    description: "Primary background color for active/pressed states",
    categories: ["background"],
    scales: ["neutral", "accent", ".."],
  },
  "color-primary-muted": {
    defaultValue: "var(--neutral-200)",
    description: "Muted primary background color for subtle emphasis",
    categories: ["background"],
    scales: ["neutral", "accent", ".."],
  },

  "color-success": {
    defaultValue: "var(--success-500)",
    description: "Background color for success states and positive actions",
    categories: ["background"],
    scales: ["success"],
  },
  "color-success-hover": {
    defaultValue: "var(--success-600)",
    description: "Success background color for hover states",
    categories: ["background"],
    scales: ["success"],
  },
  "color-success-active": {
    defaultValue: "var(--success-700)",
    description: "Success background color for active/pressed states",
    categories: ["background"],
    scales: ["success"],
  },
  "color-success-muted": {
    defaultValue: "var(--success-50)",
    description: "Muted success background color for subtle positive feedback",
    categories: ["background"],
    scales: ["success"],
  },

  "color-warning": {
    defaultValue: "var(--warning-500)",
    description: "Background color for warning states and cautionary actions",
    categories: ["background"],
    scales: ["warning"],
  },
  "color-warning-hover": {
    defaultValue: "var(--warning-600)",
    description: "Warning background color for hover states",
    categories: ["background"],
    scales: ["warning"],
  },
  "color-warning-active": {
    defaultValue: "var(--warning-700)",
    description: "Warning background color for active/pressed states",
    categories: ["background"],
    scales: ["warning"],
  },
  "color-warning-muted": {
    defaultValue: "var(--warning-50)",
    description:
      "Muted warning background color for subtle cautionary feedback",
    categories: ["background"],
    scales: ["warning"],
  },

  "color-danger": {
    defaultValue: "var(--danger-500)",
    description: "Background color for error states and destructive actions",
    categories: ["background"],
    scales: ["danger"],
  },
  "color-danger-hover": {
    defaultValue: "var(--danger-600)",
    description: "Danger background color for hover states",
    categories: ["background"],
    scales: ["danger"],
  },
  "color-danger-active": {
    defaultValue: "var(--danger-700)",
    description: "Danger background color for active/pressed states",
    categories: ["background"],
    scales: ["danger"],
  },
  "color-danger-muted": {
    defaultValue: "var(--danger-50)",
    description: "Muted danger background color for subtle error feedback",
    categories: ["background"],
    scales: ["danger"],
  },

  "color-info": {
    defaultValue: "var(--info-500)",
    description:
      "Background color for informational states and neutral actions",
    categories: ["background"],
    scales: ["info"],
  },
  "color-info-hover": {
    defaultValue: "var(--info-600)",
    description: "Info background color for hover states",
    categories: ["background"],
    scales: ["info"],
  },
  "color-info-active": {
    defaultValue: "var(--info-700)",
    description: "Info background color for active/pressed states",
    categories: ["background"],
    scales: ["info"],
  },
  "color-info-muted": {
    defaultValue: "var(--info-50)",
    description:
      "Muted info background color for subtle informational feedback",
    categories: ["background"],
    scales: ["info"],
  },

  "color-accent": {
    defaultValue: "var(--accent-500)",
    description: "Background color for accent elements and brand emphasis",
    categories: ["background"],
    scales: ["accent"],
  },
  "color-accent-hover": {
    defaultValue: "var(--accent-600)",
    description: "Accent background color for hover states",
    categories: ["background"],
    scales: ["accent"],
  },
  "color-accent-active": {
    defaultValue: "var(--accent-700)",
    description: "Accent background color for active/pressed states",
    categories: ["background"],
    scales: ["accent"],
  },
  "color-accent-muted": {
    defaultValue: "var(--accent-50)",
    description: "Muted accent background color for subtle brand emphasis",
    categories: ["background"],
    scales: ["accent"],
  },
  "color-accent-muted-hover": {
    defaultValue: "var(--accent-100)",
    description: "Muted accent background color for hover states",
    categories: ["background"],
    scales: ["accent"],
  },

  "color-fg": {
    defaultValue: "var(--neutral-950)",
    description: "Primary text color for main content",
    categories: ["foreground"],
    scales: ["neutral", ".."],
  },
  "color-fg-muted": {
    defaultValue: "var(--neutral-800)",
    description: "Muted text color for secondary content and descriptions",
    categories: ["foreground"],
    scales: ["neutral", ".."],
  },
  "color-fg-inverse": {
    defaultValue: "var(--neutral-50)",
    description: "Inverse text color for dark backgrounds",
    categories: ["foreground"],
    scales: ["neutral", ".."],
  },
  "color-fg-disabled": {
    defaultValue: "var(--neutral-500)",
    description: "Text color for disabled elements",
    categories: ["foreground"],
    scales: ["neutral", ".."],
  },
  "color-fg-danger": {
    defaultValue: "var(--danger-700)",
    description: "Text color for error messages and destructive actions",
    categories: ["foreground"],
    scales: ["danger"],
  },
  "color-fg-warning": {
    defaultValue: "var(--warning-700)",
    description: "Text color for warning messages and cautionary content",
    categories: ["foreground"],
    scales: ["warning"],
  },
  "color-fg-success": {
    defaultValue: "var(--success-700)",
    description: "Text color for success messages and positive feedback",
    categories: ["foreground"],
    scales: ["success"],
  },
  "color-fg-info": {
    defaultValue: "var(--info-700)",
    description: "Text color for informational messages and neutral content",
    categories: ["foreground"],
    scales: ["info"],
  },
  "color-fg-accent": {
    defaultValue: "var(--accent-700)",
    description: "Text color for accent content and brand elements",
    categories: ["foreground"],
    scales: ["accent"],
  },

  "color-fg-on-neutral": {
    defaultValue: "var(--on-neutral-200)",
    description: "Text color for content on neutral backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-primary": {
    defaultValue: "var(--on-neutral-950)",
    description: "Text color for content on primary backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-accent": {
    defaultValue: "var(--on-accent-500)",
    description: "Text color for content on accent backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-success": {
    defaultValue: "var(--on-success-500)",
    description: "Text color for content on success backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-danger": {
    defaultValue: "var(--on-danger-500)",
    description: "Text color for content on danger backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-warning": {
    defaultValue: "var(--on-warning-500)",
    description: "Text color for content on warning backgrounds",
    categories: ["foreground"],
  },
  "color-fg-on-info": {
    defaultValue: "var(--on-info-500)",
    description: "Text color for content on info backgrounds",
    categories: ["foreground"],
  },

  "color-border": {
    defaultValue: "var(--neutral-300)",
    description: "Default border color for components and dividers",
    categories: ["border"],
    scales: ["neutral", ".."],
  },
  "color-border-hover": {
    defaultValue: "var(--neutral-400)",
    description: "Border color for hover states",
    categories: ["border"],
    scales: ["neutral", ".."],
  },
  "color-border-field": {
    defaultValue: "var(--neutral-400)",
    description: "Border color for form fields and inputs",
    categories: ["border"],
    scales: ["neutral", ".."],
  },
  "color-border-control": {
    defaultValue: "var(--neutral-700)",
    description:
      "Border color for control elements like checkboxes and toggles",
    categories: ["border"],
    scales: ["neutral", ".."],
  },
  "color-border-disabled": {
    defaultValue: "var(--neutral-300)",
    description: "Border color for disabled elements",
    categories: ["border"],
    scales: ["neutral", ".."],
  },
  "color-border-focus": {
    defaultValue: "var(--accent-500)",
    description:
      "Border color for focused elements and accessibility indicators",
    categories: ["border"],
    scales: ["neutral", "accent", ".."],
  },
  "color-border-focus-muted": {
    defaultValue: "var(--accent-300)",
    description:
      "Muted border color for focused elements and accessibility indicators",
    categories: ["border"],
    scales: ["neutral", "accent", ".."],
  },

  "color-border-success": {
    defaultValue: "var(--success-300)",
    description: "Border color for success states and positive feedback",
    categories: ["border"],
    scales: ["success"],
  },
  "color-border-accent": {
    defaultValue: "var(--accent-300)",
    description: "Border color for accent elements and brand emphasis",
    categories: ["border"],
    scales: ["accent"],
  },
  "color-border-danger": {
    defaultValue: "var(--danger-300)",
    description: "Border color for error states and destructive actions",
    categories: ["border"],
    scales: ["danger"],
  },
  "color-border-warning": {
    defaultValue: "var(--warning-300)",
    description: "Border color for warning states and cautionary content",
    categories: ["border"],
    scales: ["warning"],
  },
  "color-border-info": {
    defaultValue: "var(--info-300)",
    description: "Border color for informational states and neutral content",
    categories: ["border"],
    scales: ["info"],
  },
};

export const RADIUS_TOKENS: Record<string, Token> = {
  "radius-xs": { defaultValue: "calc(0.125rem * var(--radius-factor))" },
  "radius-sm": { defaultValue: "calc(0.25rem * var(--radius-factor))" },
  "radius-md": { defaultValue: "calc(0.375rem * var(--radius-factor))" },
  "radius-lg": { defaultValue: "calc(0.5rem * var(--radius-factor))" },
  "radius-xl": { defaultValue: "calc(0.75rem * var(--radius-factor))" },
  "radius-2xl": { defaultValue: "calc(1rem * var(--radius-factor))" },
  "radius-3xl": { defaultValue: "calc(1.5rem * var(--radius-factor))" },
  "radius-4xl": { defaultValue: "calc(2rem * var(--radius-factor))" },
};

export const TYPOGRAPHY_TOKENS: Record<string, Token> = {
  "font-body": {
    defaultValue: "var(--font-body)",
    description: "Default font family for body text",
    categories: ["typography"],
  },
  "font-heading": {
    defaultValue: "var(--font-heading)",
    description: "Font family for headings and titles",
    categories: ["typography"],
  },
};

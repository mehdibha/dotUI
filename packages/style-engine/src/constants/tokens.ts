export interface Token {
  name: string;
  defaultValue: string;
  description: string;
  category: TokenCategory;
}

export type TokenCategory =
  | "background"
  | "foreground"
  | "border"
  | "typography"
  | "spacing";

export const DESIGN_TOKENS: Token[] = [
  {
    name: "font-body",
    defaultValue: "var(--font-body)",
    description: "Default font family for body text",
    category: "typography",
  },
  {
    name: "font-heading",
    defaultValue: "var(--font-heading)",
    description: "Font family for headings and titles",
    category: "typography",
  },

  {
    name: "color-bg",
    defaultValue: "var(--neutral-100)",
    description: "Primary background color for main content areas",
    category: "background",
  },
  {
    name: "color-bg-muted",
    defaultValue: "var(--neutral-200)",
    description: "Muted background color for secondary content areas",
    category: "background",
  },
  {
    name: "color-bg-inverse",
    defaultValue: "var(--neutral-1000)",
    description:
      "Inverse background color for dark themes or contrasting areas",
    category: "background",
  },
  {
    name: "color-bg-disabled",
    defaultValue: "var(--neutral-200)",
    description: "Background color for disabled elements",
    category: "background",
  },

  {
    name: "color-bg-neutral",
    defaultValue: "var(--neutral-200)",
    description: "Neutral background color for buttons and components",
    category: "background",
  },
  {
    name: "color-bg-neutral-hover",
    defaultValue: "var(--neutral-300)",
    description: "Neutral background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-neutral-active",
    defaultValue: "var(--neutral-400)",
    description: "Neutral background color for active/pressed states",
    category: "background",
  },

  {
    name: "color-bg-primary",
    defaultValue: "var(--neutral-1000)",
    description: "Primary background color for main actions and emphasis",
    category: "background",
  },
  {
    name: "color-bg-primary-hover",
    defaultValue: "var(--neutral-900)",
    description: "Primary background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-primary-active",
    defaultValue: "var(--neutral-800)",
    description: "Primary background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-primary-muted",
    defaultValue: "var(--neutral-200)",
    description: "Muted primary background color for subtle emphasis",
    category: "background",
  },

  {
    name: "color-bg-success",
    defaultValue: "var(--success-500)",
    description: "Background color for success states and positive actions",
    category: "background",
  },
  {
    name: "color-bg-success-hover",
    defaultValue: "var(--success-600)",
    description: "Success background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-success-active",
    defaultValue: "var(--success-700)",
    description: "Success background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-success-muted",
    defaultValue: "var(--success-200)",
    description: "Muted success background color for subtle positive feedback",
    category: "background",
  },

  {
    name: "color-bg-warning",
    defaultValue: "var(--warning-500)",
    description: "Background color for warning states and cautionary actions",
    category: "background",
  },
  {
    name: "color-bg-warning-hover",
    defaultValue: "var(--warning-600)",
    description: "Warning background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-warning-active",
    defaultValue: "var(--warning-700)",
    description: "Warning background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-warning-muted",
    defaultValue: "var(--warning-200)",
    description:
      "Muted warning background color for subtle cautionary feedback",
    category: "background",
  },

  {
    name: "color-bg-danger",
    defaultValue: "var(--danger-500)",
    description: "Background color for error states and destructive actions",
    category: "background",
  },
  {
    name: "color-bg-danger-hover",
    defaultValue: "var(--danger-600)",
    description: "Danger background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-danger-active",
    defaultValue: "var(--danger-700)",
    description: "Danger background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-danger-muted",
    defaultValue: "var(--danger-200)",
    description: "Muted danger background color for subtle error feedback",
    category: "background",
  },

  {
    name: "color-bg-info",
    defaultValue: "var(--info-500)",
    description:
      "Background color for informational states and neutral actions",
    category: "background",
  },
  {
    name: "color-bg-info-hover",
    defaultValue: "var(--info-600)",
    description: "Info background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-info-active",
    defaultValue: "var(--info-700)",
    description: "Info background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-info-muted",
    defaultValue: "var(--info-200)",
    description:
      "Muted info background color for subtle informational feedback",
    category: "background",
  },

  {
    name: "color-bg-accent",
    defaultValue: "var(--accent-500)",
    description: "Background color for accent elements and brand emphasis",
    category: "background",
  },
  {
    name: "color-bg-accent-hover",
    defaultValue: "var(--accent-600)",
    description: "Accent background color for hover states",
    category: "background",
  },
  {
    name: "color-bg-accent-active",
    defaultValue: "var(--accent-700)",
    description: "Accent background color for active/pressed states",
    category: "background",
  },
  {
    name: "color-bg-accent-muted",
    defaultValue: "var(--accent-200)",
    description: "Muted accent background color for subtle brand emphasis",
    category: "background",
  },
  {
    name: "color-bg-accent-muted-hover",
    defaultValue: "var(--accent-300)",
    description: "Muted accent background color for hover states",
    category: "background",
  },

  {
    name: "color-fg",
    defaultValue: "var(--neutral-1000)",
    description: "Primary text color for main content",
    category: "foreground",
  },
  {
    name: "color-fg-muted",
    defaultValue: "var(--neutral-800)",
    description: "Muted text color for secondary content and descriptions",
    category: "foreground",
  },
  {
    name: "color-fg-inverse",
    defaultValue: "var(--neutral-100)",
    description: "Inverse text color for dark backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-disabled",
    defaultValue: "var(--neutral-500)",
    description: "Text color for disabled elements",
    category: "foreground",
  },
  {
    name: "color-fg-danger",
    defaultValue: "var(--danger-700)",
    description: "Text color for error messages and destructive actions",
    category: "foreground",
  },
  {
    name: "color-fg-warning",
    defaultValue: "var(--warning-700)",
    description: "Text color for warning messages and cautionary content",
    category: "foreground",
  },
  {
    name: "color-fg-success",
    defaultValue: "var(--success-700)",
    description: "Text color for success messages and positive feedback",
    category: "foreground",
  },
  {
    name: "color-fg-info",
    defaultValue: "var(--info-700)",
    description: "Text color for informational messages and neutral content",
    category: "foreground",
  },
  {
    name: "color-fg-accent",
    defaultValue: "var(--accent-700)",
    description: "Text color for accent content and brand elements",
    category: "foreground",
  },

  {
    name: "color-fg-onNeutral",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on neutral backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onPrimary",
    defaultValue: "var(--neutral-100)",
    description: "Text color for content on primary backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onAccent",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on accent backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onSuccess",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on success backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onDanger",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on danger backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onWarning",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on warning backgrounds",
    category: "foreground",
  },
  {
    name: "color-fg-onInfo",
    defaultValue: "var(--neutral-1000)",
    description: "Text color for content on info backgrounds",
    category: "foreground",
  },

  {
    name: "color-border",
    defaultValue: "var(--neutral-300)",
    description: "Default border color for components and dividers",
    category: "border",
  },
  {
    name: "color-border-hover",
    defaultValue: "var(--neutral-400)",
    description: "Border color for hover states",
    category: "border",
  },
  {
    name: "color-border-field",
    defaultValue: "var(--neutral-400)",
    description: "Border color for form fields and inputs",
    category: "border",
  },
  {
    name: "color-border-control",
    defaultValue: "var(--neutral-700)",
    description:
      "Border color for control elements like checkboxes and toggles",
    category: "border",
  },
  {
    name: "color-border-disabled",
    defaultValue: "var(--neutral-300)",
    description: "Border color for disabled elements",
    category: "border",
  },
  {
    name: "color-border-focus",
    defaultValue: "var(--accent-500)",
    description:
      "Border color for focused elements and accessibility indicators",
    category: "border",
  },

  {
    name: "color-border-success",
    defaultValue: "var(--success-300)",
    description: "Border color for success states and positive feedback",
    category: "border",
  },
  {
    name: "color-border-accent",
    defaultValue: "var(--accent-300)",
    description: "Border color for accent elements and brand emphasis",
    category: "border",
  },
  {
    name: "color-border-danger",
    defaultValue: "var(--danger-300)",
    description: "Border color for error states and destructive actions",
    category: "border",
  },
  {
    name: "color-border-warning",
    defaultValue: "var(--warning-300)",
    description: "Border color for warning states and cautionary content",
    category: "border",
  },
  {
    name: "color-border-info",
    defaultValue: "var(--info-300)",
    description: "Border color for informational states and neutral content",
    category: "border",
  },

  {
    name: "radius-xs",
    defaultValue: "calc(0.125rem * var(--radius-factor))",
    description: "Extra small border radius for subtle rounding",
    category: "spacing",
  },
  {
    name: "radius-sm",
    defaultValue: "calc(0.25rem * var(--radius-factor))",
    description: "Small border radius for buttons and form elements",
    category: "spacing",
  },
  {
    name: "radius-md",
    defaultValue: "calc(0.375rem * var(--radius-factor))",
    description: "Medium border radius for cards and containers",
    category: "spacing",
  },
  {
    name: "radius-lg",
    defaultValue: "calc(0.5rem * var(--radius-factor))",
    description: "Large border radius for prominent components",
    category: "spacing",
  },
  {
    name: "radius-xl",
    defaultValue: "calc(0.75rem * var(--radius-factor))",
    description: "Extra large border radius for emphasized elements",
    category: "spacing",
  },
  {
    name: "radius-2xl",
    defaultValue: "calc(1rem * var(--radius-factor))",
    description: "2X large border radius for modals and overlays",
    category: "spacing",
  },
  {
    name: "radius-3xl",
    defaultValue: "calc(1.5rem * var(--radius-factor))",
    description: "3X large border radius for highly rounded elements",
    category: "spacing",
  },
  {
    name: "radius-4xl",
    defaultValue: "calc(2rem * var(--radius-factor))",
    description: "4X large border radius for maximum rounding",
    category: "spacing",
  },
];

export const getTokensByCategory = (category: TokenCategory): Token[] => {
  return DESIGN_TOKENS.filter((token) => token.category === category);
};

export const getTokenByName = (name: string): Token | undefined => {
  return DESIGN_TOKENS.find((token) => token.name === name);
};

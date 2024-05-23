type ColorScheme = {
  "--color-bg": string;
  "--color-bg-bg-muted": string;
  "--color-bg-inverse": string;
  "--color-bg-surface": string;
  "--color-bg-disabled": string;

  "--color-bg-neutral": string;
  "--color-bg-neutral-hover": string;
  "--color-bg-neutral-active": string;

  "--color-bg-primary": string;
  "--color-bg-primary-hover": string;
  "--color-bg-primary-active": string;

  "--color-bg-success": string;
  "--color-bg-success-hover": string;
  "--color-bg-success-active": string;
  "--color-bg-success-muted": string;
  "--color-bg-success-muted-hover": string;
  "--color-bg-success-muted-active": string;

  "--color-bg-danger": string;
  "--color-bg-danger-hover": string;
  "--color-bg-danger-active": string;
  "--color-bg-danger-muted": string;
  "--color-bg-danger-muted-hover": string;
  "--color-bg-danger-muted-active": string;

  "--color-bg-warning": string;
  "--color-bg-warning-hover": string;
  "--color-bg-warning-active": string;
  "--color-bg-warning-muted": string;
  "--color-bg-warning-muted-hover": string;
  "--color-bg-warning-muted-active": string;

  "--color-bg-info": string;
  "--color-bg-info-hover": string;
  "--color-bg-info-active": string;
  "--color-bg-info-muted": string;
  "--color-bg-info-muted-hover": string;
  "--color-bg-info-muted-active": string;

  "--color-bg-tooltip": string;

  "--color-fg": string;
  "--color-fg-muted": string;
  "--color-fg-inverse": string;
  "--color-fg-muted-inverse": string;
  "--color-fg-disabled": string;

  "--color-fg-link": string;
  "--color-fg-link-hover": string;
  "--color-fg-link-active": string;
  "--color-fg-link-visited": string;

  "--color-fg-onNeutral": string;

  "--color-fg-onPrimary": string;

  "--color-fg-success": string;
  "--color-fg-onSuccess": string;
  "--color-fg-onMutedSuccess": string;

  "--color-fg-danger": string;
  "--color-fg-onDanger": string;
  "--color-fg-onMutedDanger": string;

  "--color-fg-warning": string;
  "--color-fg-onWarning": string;
  "--color-fg-onMutedWarning": string;

  "--color-fg-info": string;
  "--color-fg-onInfo": string;
  "--color-fg-onMutedInfo": string;

  "--color-fg-onTooltip": string;

  "--color-border": string;
  "--color-border-muted": string;
  "--color-border-hover": string;
  "--color-border-active": string;
  "--color-border-disabled": string;

  "--color-border-success": string;
  "--color-border-danger": string;
  "--color-border-warning": string;
  "--color-border-info": string;

  "--color-border-accent": string;
  "--color-border-secondary": string;
  "--color-border-focus": string;
  "--color-border-inverse": string;
};

export type Theme = {
  light: ColorScheme;
  dark: ColorScheme;
  radius: string;
};

export type ColorName = keyof ColorScheme;

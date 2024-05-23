import type { Theme } from "@/types/theme";

export const defaultTheme: Theme = {
  light: {
    "--color-bg": "0 0% 100%",
    "--color-bg-bg-muted": "0 0% 95%",
    "--color-bg-inverse": "240 10% 3.9%",
    "--color-bg-surface": "230 15% 98%",
    "--color-bg-disabled": "0 0% 80%",

    "--color-bg-neutral": "240 4.8% 96%",
    "--color-bg-neutral-hover": "240 4.8% 86%",
    "--color-bg-neutral-active": "240 4.8% 76%",

    "--color-bg-primary": "240 5.9% 10%",
    "--color-bg-primary-hover": "240 5.9% 20%",
    "--color-bg-primary-active": "240 5.9% 30%",

    "--color-bg-success": "0 0% 100%",
    "--color-bg-success-hover": "0 0% 100%",
    "--color-bg-success-active": "0 0% 100%",
    "--color-bg-success-muted": "0 0% 100%",
    "--color-bg-success-muted-hover": "0 0% 100%",
    "--color-bg-success-muted-active": "0 0% 100%",

    "--color-bg-danger": "0 0% 100%",
    "--color-bg-danger-hover": "0 0% 100%",
    "--color-bg-danger-active": "0 0% 100%",
    "--color-bg-danger-muted": "0 0% 100%",
    "--color-bg-danger-muted-hover": "0 0% 100%",
    "--color-bg-danger-muted-active": "0 0% 100%",

    "--color-bg-warning": "0 0% 100%",
    "--color-bg-warning-hover": "0 0% 100%",
    "--color-bg-warning-active": "0 0% 100%",
    "--color-bg-warning-muted": "0 0% 100%",
    "--color-bg-warning-muted-hover": "0 0% 100%",
    "--color-bg-warning-muted-active": "0 0% 100%",

    "--color-bg-info": "0 0% 100%",
    "--color-bg-info-hover": "0 0% 100%",
    "--color-bg-info-active": "0 0% 100%",
    "--color-bg-info-muted": "0 0% 100%",
    "--color-bg-info-muted-hover": "0 0% 100%",
    "--color-bg-info-muted-active": "0 0% 100%",

    "--color-bg-tooltip": "0 0% 100%",

    "--color-fg": "240 10% 3.9%",
    "--color-fg-muted": "240 3.8% 40%",
    "--color-fg-inverse": "0 0% 100%",
    "--color-fg-muted-inverse": "0 3.8% 80%",
    "--color-fg-disabled": "0 0% 30%",

    "--color-fg-link": "0 0% 100%",
    "--color-fg-link-hover": "0 0% 100%",
    "--color-fg-link-active": "0 0% 100%",
    "--color-fg-link-visited": "0 0% 100%",

    "--color-fg-onNeutral": "0 0% 0%",

    "--color-fg-onPrimary": "0 0% 100%",

    "--color-fg-success": "0 0% 100%",
    "--color-fg-onSuccess": "0 0% 100%",
    "--color-fg-onMutedSuccess": "0 0% 100%",

    "--color-fg-danger": "0 0% 100%",
    "--color-fg-onDanger": "0 0% 100%",
    "--color-fg-onMutedDanger": "0 0% 100%",

    "--color-fg-warning": "0 0% 100%",
    "--color-fg-onWarning": "0 0% 100%",
    "--color-fg-onMutedWarning": "0 0% 100%",

    "--color-fg-info": "0 0% 100%",
    "--color-fg-onInfo": "0 0% 100%",
    "--color-fg-onMutedInfo": "0 0% 100%",

    "--color-fg-onTooltip": "0 0% 100%",

    "--color-border": "240 5.9% 90%",
    "--color-border-muted": "240 5.9% 75%",
    "--color-border-hover": "0 0% 100%",
    "--color-border-active": "0 0% 100%",
    "--color-border-disabled": "0 0% 100%",

    "--color-border-success": "131 62% 38%",
    "--color-border-danger": "357 75% 54%",
    "--color-border-warning": "35 100% 54%",
    "--color-border-info": "212 78% 23%",

    "--color-border-accent": "0 0% 25%",
    "--color-border-secondary": "0 0% 100%",
    "--color-border-focus": "212 92% 45%",
    "--color-border-inverse": "0 0% 100%",
  },
  dark: {
    "--color-bg": "240 10% 4%",
    "--color-bg-bg-muted": "240 6% 13%",
    "--color-bg-inverse": "0 0% 100%",
    "--color-bg-surface": "0 0% 100%",
    "--color-bg-disabled": "0 0% 25%",

    "--color-bg-neutral": "240 3.7% 20%",
    "--color-bg-neutral-hover": "240 3.7% 25%",
    "--color-bg-neutral-active": "240 3.7% 30%",

    "--color-bg-primary": "0 0% 90%",
    "--color-bg-primary-hover": "0 0% 80%",
    "--color-bg-primary-active": "0 0% 70%",

    "--color-bg-success": "131 41% 46%",
    "--color-bg-success-hover": "131 41% 41%",
    "--color-bg-success-active": "131 41% 36%",
    "--color-bg-success-muted": "156 36% 11%",
    "--color-bg-success-muted-hover": "131 41% 46%",
    "--color-bg-success-muted-active": "131 41% 46%",

    "--color-bg-danger": "358 69% 52%",
    "--color-bg-danger-hover": "358 69% 57%",
    "--color-bg-danger-active": "358 69% 62%",
    "--color-bg-danger-muted": "357 46% 16%",
    "--color-bg-danger-muted-hover": "358 69% 52%",
    "--color-bg-danger-muted-active": "358 69% 52%",

    "--color-bg-warning": "35 100% 52%",
    "--color-bg-warning-hover": "35 100% 47%",
    "--color-bg-warning-active": "35 100% 42%",
    "--color-bg-warning-muted": "35 100% 15%",
    "--color-bg-warning-muted-hover": "0 0% 100%",
    "--color-bg-warning-muted-active": "0 0% 100%",

    "--color-bg-info": "212 100% 48%",
    "--color-bg-info-hover": "212 100% 48%",
    "--color-bg-info-active": "212 100% 48%",
    "--color-bg-info-muted": "214 59% 15%",
    "--color-bg-info-muted-hover": "212 100% 48%",
    "--color-bg-info-muted-active": "212 100% 48%",

    "--color-bg-tooltip": "0 0% 20%",

    "--color-fg": "0 0% 98%",
    "--color-fg-muted": "0 0% 63%",
    "--color-fg-inverse": "0 0% 0%",
    "--color-fg-muted-inverse": "0 0% 40%",
    "--color-fg-disabled": "0 0% 45%",

    "--color-fg-link": "213 100% 67%",
    "--color-fg-link-hover": "213 100% 62%",
    "--color-fg-link-active": "213 100% 57%",
    "--color-fg-link-visited": "239 100% 67%",

    "--color-fg-onNeutral": "0 0% 100%",

    "--color-fg-onPrimary": "240 5.9% 0%",

    "--color-fg-success": "131 41% 46%",
    "--color-fg-onSuccess": "0 0% 100%",
    "--color-fg-onMutedSuccess": "131 41% 46%",

    "--color-fg-danger": "357 100% 69%",
    "--color-fg-onDanger": "0 0% 100%",
    "--color-fg-onMutedDanger": "357 100% 69%",

    "--color-fg-warning": "35 100% 52%",
    "--color-fg-onWarning": "0 0% 0%",
    "--color-fg-onMutedWarning": "35 100% 52%",

    "--color-fg-info": "210 100% 66%",
    "--color-fg-onInfo": "0 0% 100%",
    "--color-fg-onMutedInfo": "210 100% 66%",

    "--color-fg-onTooltip": "0 0% 100%",

    "--color-border": "240 3.7% 22%",
    "--color-border-hover": "240 3.7% 27%",
    "--color-border-active": "240 3.7% 32%",
    "--color-border-disabled": "0 0% 25%",
    "--color-border-muted": "0 0% 25%",

    "--color-border-success": "131 41% 18%",
    "--color-border-danger": "357 55% 26%",
    "--color-border-warning": "35 100% 18%",
    "--color-border-info": "212 78% 23%",

    "--color-border-accent": "0 0% 25%",
    "--color-border-secondary": "0 0% 100%",
    "--color-border-focus": "210 100 66",
    "--color-border-inverse": "0 0% 100%",
  },
  radius: "0.5", // in rem
};

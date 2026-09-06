import type { RegistryItem } from "@/registry/types"

const calendarMeta = {
  name: "calendar",
  type: "registry:ui",
  group: "calendar",
  files: [
    {
      type: "registry:ui",
      path: "ui/calendar/base.tsx",
      target: "ui/calendar.tsx",
    },
  ],
  registryDependencies: ["button", "select", "text", "focus-styles"],
  params: {
    dayShape: {
      kind: "enum",
      default: "rounded",
      values: ["rounded", "circle", "square"] as const,
      description: "The shape of a day cell, and of the range band with it.",
    },
    today: {
      kind: "enum",
      default: "none",
      values: ["none", "ring", "fill", "numeral"] as const,
      description: "How today's cell is marked.",
    },
    // Intl has no two-letter weekday form, so `double` slices the short one.
    weekdays: {
      kind: "enum",
      default: "single",
      values: ["single", "double", "triple"] as const,
      source: {
        double: {
          'weekdayStyle = "narrow"': 'weekdayStyle = "short"',
          "{children}": "{(day) => children(day.slice(0, 2))}",
        },
        triple: { 'weekdayStyle = "narrow"': 'weekdayStyle = "short"' },
      },
      description: "The weekday header labels: S, Su or Sun.",
    },
  },
} satisfies RegistryItem

export default calendarMeta

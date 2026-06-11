/**
 * Hand-written fixture for the alert component. Exercises:
 *   - slots ({ root, title, description, action })
 *   - enum param `style` with merge-into-base semantics (default/sousse)
 *   - scalar param `radius` (cssVar `--alert-radius`, type radius) — the
 *     publisher should rewrite `rounded-(--alert-radius)` → `rounded-<suffix>`
 *
 * Kept in sync with:
 *   - www/src/registry/ui/alert/meta.ts
 *   - www/src/registry/ui/alert/styles.ts
 *   - www/src/registry/ui/alert/base.tsx
 */

import type { Publishable } from '../types'

const template = `import type * as React from "react";

import { tv, type VariantProps } from "tailwind-variants";

const alertVariants = tv(%%TV_CONFIG%%);

type AlertVariants = VariantProps<typeof alertVariants>;

interface AlertProps extends React.ComponentProps<"div">, AlertVariants {}

function Alert({ className, variant, ...props }: AlertProps) {
	const { root } = alertVariants();
	return <div data-alert="" role="alert" className={root({ variant, className })} {...props} />;
}

interface AlertTitleProps extends React.ComponentProps<"div"> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
	const { title } = alertVariants();
	return <div data-alert-title="" className={title({ className })} {...props} />;
}

interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
	const { description } = alertVariants();
	return <div data-alert-description="" className={description({ className })} {...props} />;
}

interface AlertActionProps extends React.ComponentProps<"div"> {}

function AlertAction({ className, ...props }: AlertActionProps) {
	const { action } = alertVariants();
	return <div data-alert-action="" className={action({ className })} {...props} />;
}

export type { AlertActionProps, AlertDescriptionProps, AlertProps, AlertTitleProps };
export { Alert, AlertAction, AlertDescription, AlertTitle, alertVariants };
`

export const alertPublishable: Publishable = {
  template,
  stylesConfig: {
    base: {
      slots: {
        root: [
          'relative grid w-full items-start px-4 py-3',
          'rounded-(--alert-radius)',
          'has-data-alert-action:grid-cols-[1fr_auto] has-data-alert-action:pr-3 has-data-alert-title:has-data-alert-description:gap-y-0.5 has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 has-[>svg]:has-data-alert-action:grid-cols-[--spacing(4)_1fr_auto]',
          '*:[svg]:size-4 *:[svg]:translate-y-0.5 *:[svg]:text-current',
        ],
        title: '[svg~&]:col-start-2',
        description: '[svg~&]:col-start-2',
        action:
          'flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3',
      },
      variants: {
        variant: {
          neutral: {},
          danger: {},
          warning: {},
          info: {},
          success: {},
        },
      },
      defaultVariants: {
        variant: 'neutral',
      },
    },
    density: {
      compact: {},
      default: {},
      comfortable: {},
    },
    params: {
      style: {
        default: {
          slots: {
            root: 'border bg-card text-sm',
            title: 'font-medium tracking-tight',
            description:
              'text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2',
            action: '',
          },
          variants: {
            variant: {
              neutral: { root: 'text-fg' },
              danger: {
                root: 'text-fg-danger *:data-alert-description:text-fg-danger/90',
              },
              warning: {
                root: 'text-fg-warning *:data-alert-description:text-fg-warning/90',
              },
              info: {
                root: 'text-fg-info *:data-alert-description:text-fg-info/90',
              },
              success: {
                root: 'text-fg-success *:data-alert-description:text-fg-success/90',
              },
            },
          },
          defaultVariants: { variant: 'neutral' },
        },
        sousse: {
          slots: {
            root: 'border bg-card text-sm',
            title: 'font-medium tracking-tight',
            description:
              'text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2',
            action: '',
          },
          variants: {
            variant: {
              neutral: { root: 'text-fg' },
              danger: { root: 'border-border-danger text-fg-danger' },
              warning: { root: 'border-border-warning text-fg-warning' },
              info: { root: 'border-border-info text-fg-info' },
              success: { root: 'border-border-success text-fg-success' },
            },
          },
          defaultVariants: { variant: 'neutral' },
        },
      },
    },
  },
  meta: {
    name: 'alert',
    type: 'registry:ui',
    group: 'feedback',
    files: [
      {
        type: 'registry:ui',
        path: 'ui/alert/base.tsx',
        target: 'ui/alert.tsx',
      },
    ],
    params: {
      style: {
        kind: 'enum',
        default: 'default',
        values: ['default', 'sousse'] as const,
      },
      radius: {
        kind: 'scalar',
        type: 'radius',
        cssVar: '--alert-radius',
        default: '--radius-lg',
      },
    },
  },
}

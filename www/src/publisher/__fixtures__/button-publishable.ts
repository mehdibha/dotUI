/**
 * Hand-written fixture mirroring what the build-time AST extractor will emit
 * for the button component. Used by `publish.test.ts` to exercise the full
 * request-time pipeline without needing the AST pass to be working.
 *
 * Kept in sync (manually) with:
 *   - www/src/registry/ui/button/meta.ts
 *   - www/src/registry/ui/button/styles.ts
 *   - www/src/registry/ui/button/base.tsx
 *
 * If you change those files, you'll likely need to update this fixture too.
 */

import type { Publishable } from '../types'

const template = `"use client";

import type * as React from "react";

import * as ButtonPrimitive from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitive from "react-aria-components/Link";

import { tv, type VariantProps } from "tailwind-variants";

import { Loader } from "@/components/ui/loader";

const buttonVariants = tv(%%TV_CONFIG%%);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitive.Button>, ButtonVariants {
	isIconOnly?: boolean;
}

const Button = ({ variant, size, isIconOnly, className, children, ...props }: ButtonProps) => {
	return (
		<ButtonPrimitive.Button
			data-button=""
			data-icon-only={isIconOnly ? "" : undefined}
			className={composeRenderProps(className, (cn) => buttonVariants({ variant, size, isIconOnly, className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children, { isPending }) => (
				<>
					{isPending && (
						<Loader
							data-slot="spinner"
							aria-label="loading"
							className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
						/>
					)}
					{typeof children === "string" ? <span className="truncate">{children}</span> : children}
				</>
			))}
		</ButtonPrimitive.Button>
	);
};

interface LinkButtonProps extends React.ComponentProps<typeof LinkPrimitive.Link>, ButtonVariants {
	isIconOnly?: boolean;
}

const LinkButton = ({ variant, size, isIconOnly, className, children, ...props }: LinkButtonProps) => {
	return (
		<LinkPrimitive.Link
			data-button=""
			data-icon-only={isIconOnly ? "" : undefined}
			className={composeRenderProps(className, (cn) => buttonVariants({ variant, size, isIconOnly, className: cn }))}
			{...props}
		>
			{composeRenderProps(children, (children) => (
				<>{typeof children === "string" ? <span className="truncate">{children}</span> : children}</>
			))}
		</LinkPrimitive.Link>
	);
};

export type { ButtonProps, LinkButtonProps };
export { Button, buttonVariants, LinkButton };
`

export const buttonPublishable: Publishable = {
  template,
  stylesConfig: {
    base: {
      base: [
        'group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap transition-[background-color,border-color,color,box-shadow] select-none',
        'focus-reset focus-visible:focus-ring',
        '**:[svg]:pointer-events-none **:[svg]:shrink-0',
        'pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted',
        'disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled',
      ],
      variants: {
        variant: {
          default:
            'border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:border-border-active pressed:bg-neutral-active',
          primary:
            'bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0 pending:border-0 pressed:bg-primary-active',
          quiet:
            'bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20',
          link: 'text-fg underline-offset-4 hover:underline',
          warning:
            'bg-warning text-fg-on-warning hover:bg-warning-hover pressed:bg-warning-active',
          danger:
            'bg-danger text-fg-on-danger hover:bg-danger-hover pressed:bg-danger-active',
        },
        size: {
          xs: '',
          sm: '',
          md: '',
          lg: '',
        },
        isIconOnly: {
          true: 'p-0',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'md',
      },
    },
    density: {
      compact: {
        base: 'gap-1 text-xs/relaxed',
        variants: {
          size: {
            xs: 'h-5 rounded-sm px-2 text-[0.625rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5',
            sm: 'h-6 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3',
            md: 'h-7 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
            lg: 'h-8 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4',
          },
        },
      },
      default: {
        base: 'text-sm *:[svg]:not-with-[size]:size-4',
        variants: {
          size: {
            xs: 'h-6 gap-1 px-2 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3',
            sm: 'h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
            md: 'h-8 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5',
            lg: 'h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4',
          },
        },
      },
      comfortable: {
        base: 'text-sm *:[svg]:not-with-[size]:size-4',
        variants: {
          size: {
            xs: 'h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
            sm: 'h-8 gap-1 px-2.5 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-8',
            md: 'h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9',
            lg: 'h-10 gap-1.5 px-3 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-10',
          },
        },
      },
    },
  },
  meta: {
    name: 'button',
    type: 'registry:ui',
    group: 'buttons',
    files: [
      {
        type: 'registry:ui',
        path: 'ui/button/base.tsx',
        target: 'ui/button.tsx',
      },
    ],
    registryDependencies: ['loader', 'focus-styles'],
  },
}

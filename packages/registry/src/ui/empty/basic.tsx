import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

const emptyVariants = tv({
	slots: {
		base: "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
		header: "flex max-w-sm flex-col items-center gap-2 text-center",
		title: "font-medium text-lg tracking-tight",
		description: "text-fg-muted text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
		content: "flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
		media: "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
	},
	variants: {
		variant: {
			default: {
				media: "bg-transparent",
			},
			icon: {
				media:
					"flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-fg [&_svg:not([class*='size-'])]:size-6",
			},
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const { base, header, title, description, content, media } = emptyVariants();

/* -----------------------------------------------------------------------------------------------*/

interface EmptyProps extends React.ComponentProps<"div"> {}

const Empty = ({ className, ...props }: EmptyProps) => {
	return <div data-slot="empty" className={base({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyHeaderProps extends React.ComponentProps<"div"> {}

const EmptyHeader = ({ className, ...props }: EmptyHeaderProps) => {
	return <div data-slot="empty-header" className={header({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyTitleProps extends React.ComponentProps<"div"> {}

const EmptyTitle = ({ className, ...props }: EmptyTitleProps) => {
	return <div data-slot="empty-title" className={title({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyDescriptionProps extends React.ComponentProps<"div"> {}

const EmptyDescription = ({ className, ...props }: EmptyDescriptionProps) => {
	return <div data-slot="empty-description" className={description({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyContentProps extends React.ComponentProps<"div"> {}

const EmptyContent = ({ className, ...props }: EmptyContentProps) => {
	return <div data-slot="empty-content" className={content({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface EmptyMediaProps extends React.ComponentProps<"div">, VariantProps<typeof emptyVariants> {}
const EmptyMedia = ({ variant, className, ...props }: EmptyMediaProps) => {
	return <div data-slot="empty-media" className={media({ variant, className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia };

export type {
	EmptyProps,
	EmptyHeaderProps,
	EmptyTitleProps,
	EmptyDescriptionProps,
	EmptyContentProps,
	EmptyMediaProps,
};

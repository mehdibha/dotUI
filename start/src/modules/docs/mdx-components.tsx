import { ArrowUpRightIcon } from "lucide-react";
import type { MDXComponents } from "mdx/types";

import { cn } from "@dotui/registry/lib/utils";
import { Alert, type AlertProps } from "@dotui/registry/ui/alert";
import { Link, type LinkProps } from "@dotui/registry/ui/link";

import {
	CodeBlock,
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	Demo,
	type DemoProps,
	Example,
	Examples,
	InteractiveDemo,
	type InteractiveDemoProps,
	PageTabPanel,
	PageTabs,
	Pre,
	Reference,
	type ReferenceProps,
} from "./stubs";

export const mdxComponents: MDXComponents = {
	h1: ({ className, ...props }) => <h1 className={cn("mt-2 scroll-m-20 font-bold text-4xl", className)} {...props} />,
	h2: ({ className, ...props }) => (
		<h2
			className={cn("mt-12 scroll-m-20 border-b pb-2 font-semibold text-2xl tracking-tight first:mt-0", className)}
			{...props}
		/>
	),
	h3: ({ className, ...props }) => (
		<h3 className={cn("mt-8 scroll-m-20 font-semibold text-xl tracking-tight", className)} {...props} />
	),
	h4: ({ className, ...props }) => (
		<h4 className={cn("mt-8 scroll-m-20 font-semibold text-lg tracking-tight", className)} {...props} />
	),
	h5: ({ className, ...props }) => (
		<h5 className={cn("mt-8 scroll-m-20 font-semibold text-lg tracking-tight", className)} {...props} />
	),
	h6: ({ className, ...props }) => (
		<h6 className={cn("mt-8 scroll-m-20 font-semibold text-base tracking-tight", className)} {...props} />
	),
	p: ({ className, ...props }) => <p className={cn("not-first:mt-4 text-base leading-7", className)} {...props} />,
	a: ({ className, children, ...props }: LinkProps & { children?: React.ReactNode }) => (
		<Link target={props.href?.startsWith("/") ? "_self" : "_blank"} className={cn("inline", className)} {...props}>
			{children}
			{!props.href?.startsWith("/") && (
				<span className="inline-flex">
					<ArrowUpRightIcon className="size-4" />
				</span>
			)}
		</Link>
	),
	ul: ({ className, ...props }) => <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />,
	ol: ({ className, ...props }) => <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />,
	li: ({ className, ...props }) => <li className={cn("mt-2", className)} {...props} />,
	blockquote: ({ className, ...props }) => (
		<blockquote className={cn("mt-6 border-l-2 pl-6 italic *:text-fg-muted", className)} {...props} />
	),
	img: ({ className, alt, src, ...props }) => (
		<img className={cn("mx-auto max-w-md rounded-md border", className)} alt={alt} src={src} {...props} />
	),
	hr: (props) => <hr className="my-4 md:my-8" {...props} />,
	pre: ({ className, ...props }) => (
		<CodeBlock className={cn("-mx-px mt-6", className)} {...props}>
			<Pre>{props.children}</Pre>
		</CodeBlock>
	),
	code: (props) => (
		<code
			className="not-in-[pre]:rounded-sm not-in-[pre]:border not-in-[pre]:bg-card not-in-[pre]:px-1.25 not-in-[pre]:py-0.75 not-in-[pre]:font-normal not-in-[pre]:text-[0.9375rem] **:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)"
			{...props}
		/>
	),
	Alert: ({ className, ...props }: AlertProps) => <Alert className={cn("mt-4", className)} {...props} />,
	Steps: (props) => <div className="[&>h3]:step ml-4 border-l pl-8 [counter-reset:step]" {...props} />,
	PageTabs,
	PageTabPanel,
	CodeBlockTabs: ({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) => (
		<CodeBlockTabs defaultValue={defaultValue}>{children}</CodeBlockTabs>
	),
	CodeBlockTabsList,
	CodeBlockTabsTrigger: ({ value, children }: { value: string; children: React.ReactNode }) => (
		<CodeBlockTabsTrigger value={value}>{children}</CodeBlockTabsTrigger>
	),
	CodeBlockTab: ({ value, children }: { value: string; children: React.ReactNode }) => (
		<CodeBlockTab value={value}>{children}</CodeBlockTab>
	),
	Demo: ({ className, ...props }: DemoProps) => <Demo className={cn("not-first:mt-4", className)} {...props} />,
	Example,
	Examples,
	InteractiveDemo: ({ className, ...props }: InteractiveDemoProps) => (
		<InteractiveDemo className={cn("not-first:mt-4", className)} {...props} />
	),
	Reference: ({ name }: ReferenceProps) => <Reference name={name} className="mt-4" />,
};

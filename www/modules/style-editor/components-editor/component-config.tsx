"use client";

import { cn } from "@dotui/registry/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@dotui/registry/ui/select";

import { TokensTable } from "@/modules/style-editor/colors-editor/tokens-table";

interface ComponentConfigProps extends React.ComponentProps<"div"> {
	name: string;
	title: string;
	variants: { name: string; label: string }[];
	previewClassName?: string;
	tokens?: string[];
}

export const ComponentConfig = ({
	name,
	title,
	variants,
	tokens,
	previewClassName,
	children,
	className,
	...props
}: ComponentConfigProps) => {
	return (
		<div className={cn(className)} {...props}>
			<p className={cn("font-semibold text-base", title !== "Loader" && "mt-6")}>{title}</p>

			<Select aria-label="Select component variant" defaultSelectedKey={variants[0]?.name} className="mt-2 w-full">
				<SelectTrigger />
				<SelectContent>
					{variants.map((variant) => (
						<SelectItem key={variant.name} id={variant.name}>
							{variant.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{tokens && tokens.length > 0 && (
				<div className="mt-2">
					{/* Simplified tokens display - just show the token names */}
					<div className="flex flex-wrap gap-1">
						{tokens.map((token) => (
							<span key={token} className="rounded bg-muted px-2 py-1 text-xs">
								{token}
							</span>
						))}
					</div>
				</div>
			)}

			<div className={cn("mt-2 flex items-center justify-center gap-2 rounded-md border px-4 py-8", previewClassName)}>
				{children}
			</div>
		</div>
	);
};

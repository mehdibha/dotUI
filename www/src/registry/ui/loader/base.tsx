"use client";

import { Loader2Icon } from "lucide-react";
import { ProgressBar as AriaProgressBar } from "react-aria-components";
import type { ProgressBarProps } from "react-aria-components";

import { cn } from "@/registry/lib/utils";

interface LoaderProps extends ProgressBarProps {}

function Loader({ className, ...props }: LoaderProps) {
	return (
		<AriaProgressBar
			data-loader=""
			className={cn("inline-flex shrink-0 items-center justify-center", className)}
			aria-label="loading..."
			{...props}
			isIndeterminate
		>
			<Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin")} />
		</AriaProgressBar>
	);
}

export type { LoaderProps };
export { Loader };

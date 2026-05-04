"use client";

import * as ProgressBarPrimitives from "react-aria-components/ProgressBar";

import { cn } from "@/registry/lib/utils";

interface LoaderProps extends ProgressBarPrimitives.ProgressBarProps {}

function Loader({ className, ...props }: LoaderProps) {
	return (
		<ProgressBarPrimitives.ProgressBar
			data-loader=""
			className={cn("inline-flex shrink-0 items-center justify-center", className)}
			aria-label="loading..."
			{...props}
			isIndeterminate
		>
			<svg
				role="status"
				aria-label="Loading"
				viewBox="0 0 24 24"
				fill="none"
				className="size-4 animate-spin"
			>
				<circle className="stroke-current opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
				<path
					className="fill-current"
					d="M22 12a10 10 0 0 1-10 10v-4a6 6 0 0 0 6-6h4Z"
				/>
			</svg>
		</ProgressBarPrimitives.ProgressBar>
	);
}

export type { LoaderProps };
export { Loader };

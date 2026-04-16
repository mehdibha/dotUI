"use client";

import { Loader2Icon } from "lucide-react";
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
			<Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin")} />
		</ProgressBarPrimitives.ProgressBar>
	);
}

export type { LoaderProps };
export { Loader };

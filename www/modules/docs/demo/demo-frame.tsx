"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/preferences/preferences-atom";
import { ActiveStyleSelector } from "@/modules/styles/active-style-selector";
import { useActiveStyle } from "@/modules/styles/use-active-style";

interface DemoFrameProps {
	children: ReactNode;
	className?: string;
}

export const DemoFrame = ({ className, children }: DemoFrameProps) => {
	const { activeMode, setActiveMode } = usePreferences();
	const { data: style } = useActiveStyle();
	const isMounted = useMounted();

	// Check if both light and dark modes are enabled
	const modes = style?.config?.theme?.colors?.modes;
	const canToggleTheme =
		Boolean(style) &&
		isMounted &&
		Boolean(modes?.light && modes?.dark);

	return (
		<div
			className={cn(
				"relative z-1 flex min-h-56 flex-1 items-center justify-center rounded-t-lg border bg-bg p-10 pt-14",
				className,
			)}
		>
			<ActiveStyleSelector
				buttonProps={{
					size: "sm",
					variant: "quiet",
					className: "text-xs h-7 border-0 absolute left-1.5 top-1.5",
				}}
			/>
			{canToggleTheme && (
				<Button
					size="sm"
					variant="quiet"
					className="absolute top-1.5 right-1.5 size-7 border-0"
					onPress={() => setActiveMode(activeMode === "dark" ? "light" : "dark")}
				>
					{activeMode === "dark" ? <MoonIcon /> : <SunIcon />}
				</Button>
			)}
			{children}
		</div>
	);
};

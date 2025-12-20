"use client";

import React from "react";
import { UNSAFE_PortalProvider as PortalProvider } from "react-aria";

import { cn } from "@dotui/registry/lib/utils";
import { StyleProvider } from "@dotui/core/react";
import type { StyleConfig } from "@dotui/core/schemas";
import { Skeleton } from "@dotui/registry/ui/skeleton";

import { useMounted } from "@/hooks/use-mounted";
import { usePreferences } from "@/modules/preferences/preferences-atom";
import { useActiveStyle } from "@/modules/styles/use-active-style";

export function ActiveStyleProvider({
	unstyled,
	skeletonClassName,
	...props
}: Omit<React.ComponentProps<"div">, "style"> & {
	unstyled?: boolean;
	skeletonClassName?: string;
}) {
	const portalContext = useActiveStylePortalContext();
	const localRef = React.useRef<HTMLDivElement>(null);
	const container = portalContext ?? localRef;
	const { activeMode } = usePreferences();
	const { data: activeStyle, isPending } = useActiveStyle();
	const isMounted = useMounted();

	// Always render skeleton on server and during initial hydration to avoid mismatch
	if (!isMounted || isPending || !activeStyle?.config) {
		return (
			<Skeleton {...props} className={cn("rounded-none", skeletonClassName, props.className)}>
				{props.children}
			</Skeleton>
		);
	}

	return (
		<StyleProvider mode={activeMode} config={activeStyle.config as StyleConfig} unstyled={unstyled} {...props}>
			<PortalProvider getContainer={() => container.current}>{props.children}</PortalProvider>
		</StyleProvider>
	);
}

const ActiveStyleContext = React.createContext<React.RefObject<HTMLDivElement | null> | null>(null);

const useActiveStylePortalContext = () => {
	return React.useContext(ActiveStyleContext);
};

export const ActiveStylePortalProvider = ({ children }: { children: React.ReactNode }) => {
	const container = React.useRef<HTMLDivElement>(null);
	const { activeMode } = usePreferences();
	const { data: activeStyle } = useActiveStyle();

	if (!activeStyle?.config) return <>{children}</>;

	return (
		<ActiveStyleContext.Provider value={container}>
			<StyleProvider ref={container} mode={activeMode} config={activeStyle.config as StyleConfig} unstyled />
			{children}
		</ActiveStyleContext.Provider>
	);
};

"use client";

import * as React from "react";
import { useSlotId } from "react-aria/private/utils/useId";
import { useControlledState } from "react-stately/useControlledState";
import { PanelLeftIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";
import * as HeaderPrimitives from "react-aria-components/Header";
import * as HeadingPrimitives from "react-aria-components/Heading";
import { DEFAULT_SLOT, Provider } from "react-aria-components/slots";

import { useKeyboardShortcut } from "@/registry/hooks/use-keyboard-shortcut";
import { createContext } from "@/registry/lib/context";
import { cn } from "@/registry/lib/utils";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import { useStyles } from "./styles";

// MARK: sidebarStyles

const SIDEBAR_WIDTH = "15rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContextProps = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	toggleSidebar: () => void;
};

const [SidebarContext, useSidebarContext] = createContext<SidebarContextProps>({
	name: "SidebarProvider",
	strict: true,
});

function SidebarProvider({
	defaultOpen = true,
	isOpen: isOpenProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	...props
}: React.ComponentProps<"div"> & {
	defaultOpen?: boolean;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [isOpen, setOpen] = useControlledState<boolean>(isOpenProp, defaultOpen, setOpenProp);

	const toggleSidebar = React.useCallback(() => {
		setOpen(!isOpen);
	}, [setOpen, isOpen]);

	useKeyboardShortcut({
		key: SIDEBAR_KEYBOARD_SHORTCUT,
		metaKey: true,
		onPress: toggleSidebar,
	});

	return (
		<SidebarContext
			value={{
				isOpen,
				setOpen,
				toggleSidebar,
			}}
		>
			<div
				data-slot="sidebar-wrapper"
				style={
					{
						"--sidebar-width": SIDEBAR_WIDTH,
						"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
						...style,
					} as React.CSSProperties
				}
				className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
				{...props}
			>
				{children}
			</div>
		</SidebarContext>
	);
}

// MARK: seperator

function Sidebar({
	className,
	placement = "left",
	children,
	...props
}: React.ComponentProps<"div"> & { placement?: "left" | "right" }) {
	const { root, gap, container, inner } = useStyles()();
	const { isOpen, toggleSidebar } = useSidebarContext("Sidebar");
	const headingId = useSlotId();

	return (
		<div className={root()} data-expanded={isOpen || undefined} data-placement={placement} data-sidebar="sidebar">
			<div className={gap()} />
			<div data-slot="sidebar-container" className={container()} {...props}>
				<nav data-slot="sidebar-inner" className={inner({ className })} aria-labelledby={headingId}>
					<Provider
						values={[
							[HeadingPrimitives.HeadingContext, { id: headingId }],
							[
								ButtonPrimitives.ButtonContext,
								{
									slots: {
										[DEFAULT_SLOT]: {},
										"sidebar-trigger": {
											"aria-label": "Toggle Sidebar",
											onPress: toggleSidebar,
											children: <PanelLeftIcon />,
										},
									},
								},
							],
						]}
					>
						{children}
					</Provider>
				</nav>
			</div>
		</div>
	);
}

// MARK: seperator

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
	const { header } = useStyles()();
	return <HeaderPrimitives.Header data-slot="sidebar-header" className={header({ className })} {...props} />;
}

// MARK: seperator

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
	const { content } = useStyles()();
	return (
		<Provider values={[[HeadingPrimitives.HeadingContext, null]]}>
			<div data-slot="sidebar-content" data-sidebar="content" className={content({ className })} {...props} />
		</Provider>
	);
}

// MARK: seperator

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
	const { footer } = useStyles()();
	return (
		<Provider values={[[HeadingPrimitives.HeadingContext, null]]}>
			<div data-slot="sidebar-footer" className={footer({ className })} {...props} />
		</Provider>
	);
}

// MARK: seperator

function SidebarSection({ className, ...props }: React.ComponentProps<"section">) {
	const { section } = useStyles()();
	const headingId = useSlotId();
	return (
		<Provider values={[[HeadingPrimitives.HeadingContext, { id: headingId }]]}>
			<section data-slot="sidebar-section" aria-labelledby={headingId} className={section({ className })} {...props} />
		</Provider>
	);
}

// MARK: seperator

function SidebarSectionHeading({ className, ...props }: React.ComponentProps<"div">) {
	const { heading } = useStyles()();
	return <HeadingPrimitives.Heading data-slot="sidebar-group-label" className={heading({ className })} {...props} />;
}

// MARK: seperator

function SidebarList({ className, ...props }: React.ComponentProps<"ul">) {
	const { list } = useStyles()();
	return <ul data-slot="sidebar-list" className={list({ className })} {...props} />;
}

// MARK: seperator

function SidebarItem({
	tooltip,
	className,
	...props
}: React.ComponentProps<"li"> & {
	tooltip?: React.ReactNode;
}) {
	const { item } = useStyles()();
	const { isOpen } = useSidebarContext("SidebarItem");

	const comp = <li data-sidebar-menu-item="" className={item({ className })} {...props} />;

	if (tooltip) {
		return (
			<Tooltip isDisabled={isOpen} delay={0}>
				{comp}
				<TooltipContent hideArrow>{tooltip}</TooltipContent>
			</Tooltip>
		);
	}

	return comp;
}

// MARK: seperator

function SidebarTooltip({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
	const { isOpen } = useSidebarContext("SidebarTooltip");

	return (
		<Tooltip isDisabled={isOpen} delay={0}>
			{children}
			<TooltipContent hideArrow placement="right">
				{content}
			</TooltipContent>
		</Tooltip>
	);
}

// MARK: seperator

export {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarItem,
	SidebarList,
	SidebarProvider,
	SidebarSection,
	SidebarSectionHeading,
	SidebarTooltip,
	useSidebarContext,
};

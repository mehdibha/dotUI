"use client";

/**
 * TypePopover - A clickable type link with a popover to browse type definitions
 * Supports nested navigation with breadcrumbs (like s2-docs)
 */

import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Popover } from "@dotui/registry/ui/popover";

import { Type, useTypeLinks } from "./type-renderer";
import type { TType } from "../types/type-ast";

/* -----------------------------------------------------------------------------------------------
 * Context for nested type navigation within a popover
 * ---------------------------------------------------------------------------------------------*/

interface TypeNavigationContextValue {
	push: (name: string, type: TType) => void;
}

const TypeNavigationContext = React.createContext<TypeNavigationContextValue | null>(null);

/* -----------------------------------------------------------------------------------------------
 * TypeLink - Clickable type that opens a popover or navigates within one
 * ---------------------------------------------------------------------------------------------*/

interface TypeLinkProps {
	id: string;
	name: string;
	type: TType;
}

export function TypeLink({ name, type }: TypeLinkProps) {
	const navigationCtx = React.useContext(TypeNavigationContext);

	// If we're already inside a popover, just navigate within it
	if (navigationCtx) {
		return (
			<button
				type="button"
				onClick={() => navigationCtx.push(name, type)}
				className="cursor-pointer font-mono text-primary underline underline-offset-2"
			>
				{name}
			</button>
		);
	}

	// Otherwise, render a new popover
	return <TypePopover name={name} type={type} />;
}

/* -----------------------------------------------------------------------------------------------
 * TypePopover - Root popover component with breadcrumb navigation
 * ---------------------------------------------------------------------------------------------*/

interface BreadcrumbItem {
	id: number;
	name: string;
	type: TType;
}

interface TypePopoverProps {
	name: string;
	type: TType;
}

function TypePopover({ name, type }: TypePopoverProps) {
	const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([{ id: 0, name, type }]);
	const { links } = useTypeLinks();

	const currentItem = breadcrumbs.at(-1)!;

	const push = React.useCallback((name: string, type: TType) => {
		setBreadcrumbs((prev) => [...prev, { id: prev.length, name, type }]);
	}, []);

	const navigateTo = React.useCallback((index: number) => {
		setBreadcrumbs((prev) => prev.slice(0, index + 1));
	}, []);

	// Reset breadcrumbs when popover closes
	const handleOpenChange = React.useCallback(
		(isOpen: boolean) => {
			if (!isOpen) {
				setBreadcrumbs([{ id: 0, name, type }]);
			}
		},
		[name, type],
	);

	return (
		<Dialog onOpenChange={handleOpenChange}>
			<Button className="focus-reset focus-visible:focus-ring cursor-pointer rounded-sm font-mono text-primary underline underline-offset-2">
				{name}
			</Button>
			<Popover placement="bottom" showArrow>
				<DialogContent className="outline-none">
					{/* Breadcrumbs */}
					{breadcrumbs.length > 1 && (
						<nav className="mb-3 flex items-center gap-1 border-b pb-2 text-xs">
							{breadcrumbs.map((item, index) => (
								<React.Fragment key={item.id}>
									{index > 0 && <ChevronRightIcon className="size-3 text-fg-muted" />}
									<button
										type="button"
										onClick={() => navigateTo(index)}
										className={cn(
											"font-mono transition-colors hover:text-primary",
											index === breadcrumbs.length - 1 ? "font-medium text-fg" : "text-fg-muted",
										)}
									>
										{item.name}
									</button>
								</React.Fragment>
							))}
						</nav>
					)}

					{/* Type content */}
					<TypeNavigationContext.Provider value={{ push }}>
						<TypePopoverContent type={currentItem.type} links={links} />
					</TypeNavigationContext.Provider>
				</DialogContent>
			</Popover>
		</Dialog>
	);
}

/* -----------------------------------------------------------------------------------------------
 * TypePopoverContent - Renders the content of the popover based on type kind
 * ---------------------------------------------------------------------------------------------*/

interface TypePopoverContentProps {
	type: TType;
	links: Record<string, TType>;
}

function TypePopoverContent({ type }: TypePopoverContentProps) {
	// Show description if available
	const description = "description" in type && type.description ? type.description : null;

	// For interfaces, show a table of properties
	if (type.type === "interface") {
		const properties = Object.values(type.properties || {});

		return (
			<div className="space-y-3">
				{description && <p className="text-fg-muted text-sm leading-relaxed">{description}</p>}

				{type.extends && type.extends.length > 0 && (
					<p className="text-xs">
						<span className="text-fg-muted">Extends: </span>
						<span className="font-mono">
							{type.extends.map((ext, i) => (
								<React.Fragment key={i}>
									{i > 0 && ", "}
									<Type type={ext} />
								</React.Fragment>
							))}
						</span>
					</p>
				)}

				{properties.length > 0 && (
					<div className="divide-y divide-border/50">
						{properties.map((prop, i) => (
							<div key={i} className="py-2 first:pt-0 last:pb-0">
								<div className="flex items-baseline justify-between gap-3">
									<code className="font-mono text-fg text-xs">
										{prop.name}
										{prop.optional && <span className="text-fg-muted">?</span>}
									</code>
									<code className="font-mono text-fg-muted text-xs">
										<Type type={prop.type === "method" ? prop.value : prop.value} />
									</code>
								</div>
								{prop.description && <p className="mt-1 text-fg-muted text-xs leading-relaxed">{prop.description}</p>}
							</div>
						))}
					</div>
				)}
			</div>
		);
	}

	// For type aliases, show the resolved type
	if (type.type === "alias") {
		return (
			<div className="space-y-3">
				{description && <p className="text-fg-muted text-sm leading-relaxed">{description}</p>}
				<div className="overflow-x-auto">
					<Type type={type.value} />
				</div>
			</div>
		);
	}

	// For other types, just render them
	return (
		<div className="space-y-3">
			{description && <p className="text-fg-muted text-sm leading-relaxed">{description}</p>}
			<div className="overflow-x-auto">
				<Type type={type} />
			</div>
		</div>
	);
}

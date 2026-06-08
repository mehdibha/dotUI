import React, { type ComponentType, createElement, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { ChevronDownIcon, ChevronUpIcon, Columns2Icon, Rows2Icon } from "lucide-react";

import { CodeBlock } from "@/modules/docs/code-block";
import { renderCode } from "@/modules/docs/codegen/code-template";
import { DynamicPre } from "@/modules/docs/dynamic-pre";
import { useIsMobile } from "@/registry/hooks/use-mobile";
import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent } from "@/registry/ui/card";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import type { CodeTemplate } from "@/modules/docs/codegen/code-template";

import { availableIcons, Controls } from "./controls";
import { elementToCode, elementToPreviewCode } from "./element-to-code";

import type { ControlValues, SerializableControl } from "./types";

/**
 * Interactive demo component.
 * Renders the playground, controls, and live code output.
 *
 * Code generation has two engines, selected per demo:
 *  - SourceFirst (`codeTemplate` present): displayed code is filled from a
 *    build-time template-with-holes over the real demo source. Preview and code
 *    derive from one `values` state, so they can never diverge.
 *  - Legacy (`codeTemplate` absent): the playground is called as a plain function
 *    and its element tree serialized. Kept until every demo migrates.
 */

interface InteractiveDemoProps {
	component: ComponentType<Record<string, unknown>>;
	controls: SerializableControl[];
	className?: string;
	/**
	 * Where the controls sit on ≥md screens: a column to the right ("horizontal")
	 * or a row beneath the preview ("vertical"). Small screens are always "vertical".
	 */
	layout?: "horizontal" | "vertical";
	/**
	 * How the controls are presented: bare in the panel ("inline", current) or
	 * grouped in a titleless card ("card").
	 */
	controlsVariant?: "inline" | "card";
	/** SourceFirst engine template; absent ⇒ legacy serialization path. */
	codeTemplate?: CodeTemplate;
}

export function InteractiveDemo({
	component: Playground,
	controls,
	className,
	layout: layoutProp = "horizontal",
	controlsVariant = "inline",
	codeTemplate,
}: InteractiveDemoProps) {
	const [layout, setLayout] = useState<"horizontal" | "vertical">(layoutProp);
	const [isExpanded, setIsExpanded] = useState(false);

	// A side column doesn't fit on small screens — there the controls always drop
	// beneath the preview, regardless of the chosen/toggled layout.
	const isMobile = useIsMobile();
	const effectiveLayout = isMobile ? "vertical" : layout;
	const isRight = effectiveLayout === "horizontal";
	const controlListClass = isRight ? "flex-col gap-4" : "flex-row flex-wrap items-start gap-x-6 gap-y-4";

	// Initialize values from control defaults
	const initialValues = useMemo(() => {
		const values: ControlValues = {};
		for (const control of controls) {
			values[control.name] = getDefaultValue(control);
		}
		return values;
	}, [controls]);

	const [values, setValues] = useState<ControlValues>(initialValues);

	const handleChange = useCallback((name: string, value: unknown) => {
		setValues((prev: ControlValues) => ({ ...prev, [name]: value }));
	}, []);

	// Convert icon names to actual icon elements for preview
	const propsWithIcons = useMemo(() => {
		const props: Record<string, unknown> = { ...values };

		for (const control of controls) {
			if (control.type === "icon") {
				const iconName = values[control.name] as string | null;
				if (iconName && availableIcons[iconName]) {
					props[control.name] = createElement(availableIcons[iconName], {
						className: "size-4",
					});
				} else {
					props[control.name] = null;
				}
			}
		}

		return props;
	}, [values, controls]);

	// Create props for code generation (excludes default values unless alwaysShow)
	const propsForCode = useMemo(() => {
		const props: Record<string, unknown> = {};

		for (const control of controls) {
			const value = values[control.name];
			const defaultValue = getDefaultValue(control);
			const shouldShow = control.alwaysShow || !isEqual(value, defaultValue);

			if (shouldShow) {
				if (control.type === "icon") {
					const iconName = value as string | null;
					if (iconName && availableIcons[iconName]) {
						props[control.name] = createElement(availableIcons[iconName], {
							className: "size-4",
						});
					}
				} else {
					props[control.name] = value;
				}
			}
		}

		return props;
	}, [values, controls]);

	// Render the playground element for preview (uses ALL props). Real React render —
	// hooks/context/memo all legal — for BOTH engines.
	const previewElement = useMemo(() => createElement(Playground, propsWithIcons), [Playground, propsWithIcons]);

	// --- SourceFirst code generation (formatter-free template fill) ---
	const sourceCollapsed = useMemo(
		() => (codeTemplate ? renderCode(codeTemplate, values, { expanded: false }) : null),
		[codeTemplate, values],
	);
	const sourceExpanded = useMemo(
		() => (codeTemplate ? renderCode(codeTemplate, values, { expanded: true }) : null),
		[codeTemplate, values],
	);

	// --- Legacy code generation (only when no template) ---
	// Call the playground as a plain function to harvest its element tree, then serialize.
	const renderedElement = useMemo(() => {
		if (codeTemplate) return null;
		const PlaygroundFn = Playground as (props: Record<string, unknown>) => React.ReactElement;
		return PlaygroundFn(propsForCode);
	}, [Playground, propsForCode, codeTemplate]);
	const legacyOutput = useMemo(() => (renderedElement ? elementToCode(renderedElement) : null), [renderedElement]);
	const legacyPreview = useMemo(
		() => (renderedElement ? elementToPreviewCode(renderedElement) : ""),
		[renderedElement],
	);

	// Displayed code depends on engine + expanded state.
	const displayedCode = codeTemplate
		? ((isExpanded ? sourceExpanded : sourceCollapsed) ?? "")
		: isExpanded
			? (legacyOutput?.full ?? "")
			: legacyPreview;

	const handleToggle = () => {
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				flushSync(() => {
					setIsExpanded((prev) => !prev);
				});
			});
		} else {
			setIsExpanded((prev) => !prev);
		}
	};

	const handleLayoutToggle = () => {
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				flushSync(() => {
					setLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
				});
			});
		} else {
			setLayout((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
		}
	};

	return (
		<div className={cn("overflow-hidden rounded-lg border", className)}>
			<div className={cn("flex flex-col", isRight && "flex-row")}>
				{/* Preview — borderless open space (no card, no backdrop); the demo just sits in it */}
				<div className="flex min-h-56 flex-1 items-center justify-center p-10">{previewElement}</div>

				{/* Controls — a column beside the preview (right) or a row beneath it (bottom; always so on small screens) */}
				<div
					className={cn(
						"**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted",
						"p-5",
						isRight && (controlsVariant === "card" ? "w-72 shrink-0" : "w-64 shrink-0"),
						// Inline controls lean on a divider for separation; a card brings its own border.
						controlsVariant === "inline" && !isRight && "border-t",
					)}
				>
					{controlsVariant === "card" ? (
						<Card size="sm">
							<CardContent className={cn("flex", controlListClass)}>
								<Controls controls={controls} values={values} onChange={handleChange} layout={effectiveLayout} />
							</CardContent>
						</Card>
					) : (
						<div className={cn("flex", controlListClass)}>
							<Controls controls={controls} values={values} onChange={handleChange} layout={effectiveLayout} />
						</div>
					)}
				</div>
			</div>

			{/* Code bar — split from the panel above by a single thin divider */}
			<CodeBlock
				className="rounded-none border-x-0 border-b-0"
				actions={
					<>
						<Button variant="quiet" size="sm" className="h-7 gap-1 pr-2 pl-1 text-xs" onPress={handleToggle}>
							{isExpanded ? (
								<>
									<ChevronUpIcon /> Collapse
								</>
							) : (
								<>
									<ChevronDownIcon /> Expand
								</>
							)}
						</Button>
						{/* Layout is forced to bottom on small screens, so the toggle is desktop-only. */}
						<Tooltip>
							<Button
								aria-label="Toggle orientation"
								onPress={handleLayoutToggle}
								variant="quiet"
								size="sm"
								className="size-7 max-md:hidden"
							>
								{layout === "horizontal" ? <Columns2Icon /> : <Rows2Icon />}
							</Button>
							<TooltipContent hideArrow>Toggle layout</TooltipContent>
						</Tooltip>
					</>
				}
			>
				<DynamicPre lang="tsx">{displayedCode}</DynamicPre>
			</CodeBlock>
		</div>
	);
}

function getDefaultValue(control: SerializableControl): unknown {
	switch (control.type) {
		case "boolean":
			return control.defaultValue ?? false;
		case "string":
			return control.defaultValue ?? "";
		case "number":
			return control.defaultValue ?? 0;
		case "enum":
			return control.defaultValue ?? control.options[0];
		case "icon":
			return null;
		default:
			return undefined;
	}
}

function isEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	// Handle null/undefined equivalence for icons
	if ((a === null || a === undefined) && (b === null || b === undefined)) return true;
	return false;
}

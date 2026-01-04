import React, { type ComponentType, createElement, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronDownIcon, ChevronUpIcon, Columns2Icon, Rows2Icon } from "lucide-react";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

import { CodeBlock } from "@/modules/docs/code-block";
import { DynamicPre } from "@/modules/docs/dynamic-pre";

import { availableIcons, Controls } from "./controls";
import { elementToCode, elementToPreviewCode } from "./element-to-code";
import type { ControlValues, SerializableControl } from "./types";

/**
 * Interactive demo component.
 * Renders the playground, controls, and live code output.
 */

interface InteractiveDemoProps {
	component: ComponentType<Record<string, unknown>>;
	controls: SerializableControl[];
	className?: string;
	layout?: "horizontal" | "vertical";
}

export function InteractiveDemo({
	component: Playground,
	controls,
	className,
	layout: layoutProp = "horizontal",
}: InteractiveDemoProps) {
	const [layout, setLayout] = useState<"horizontal" | "vertical">(layoutProp);
	const [isExpanded, setIsExpanded] = useState(false);

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

	// Render the playground element for preview (uses ALL props)
	const previewElement = useMemo(() => createElement(Playground, propsWithIcons), [Playground, propsWithIcons]);

	// Call the playground function to get what it actually renders (for code serialization)
	// This gives us <TextField>...</TextField> instead of <Playground ...>
	// Uses filtered props to hide default values from code output
	const renderedElement = useMemo(() => {
		// All playground components are function components, so we can call them directly
		const PlaygroundFn = Playground as (props: Record<string, unknown>) => React.ReactElement;
		return PlaygroundFn(propsForCode);
	}, [Playground, propsForCode]);

	// Generate code by serializing the rendered element
	const codeOutput = useMemo(() => elementToCode(renderedElement), [renderedElement]);
	const previewCode = useMemo(() => elementToPreviewCode(renderedElement), [renderedElement]);

	// Displayed code depends on expanded state
	const displayedCode = isExpanded ? codeOutput.full : previewCode;

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
		<div className={cn("", className)}>
			<div className={cn("flex flex-col", layout === "horizontal" && "flex-row")}>
				{/* Preview frame */}
				<div
					className={cn(
						"flex min-h-56 flex-1 items-center justify-center border bg-bg p-10",
						layout === "horizontal" && "rounded-tl-lg border-r-0",
						layout === "vertical" && "rounded-t-lg",
					)}
				>
					{previewElement}
				</div>

				{/* Controls panel */}
				<div
					className={cn(
						"relative flex flex-col gap-2.5 bg-card p-4 **:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted",
						layout === "horizontal" && "min-w-48 rounded-tr-lg border-y border-r",
						layout === "vertical" && "border-x",
					)}
				>
					<Controls controls={controls} values={values} onChange={handleChange} />
				</div>
			</div>

			{/* Code block with toggle */}
			<CodeBlock
				className="rounded-t-none border-t-0"
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
						<Tooltip>
							<Button
								aria-label="Toggle orientation"
								onPress={handleLayoutToggle}
								variant="quiet"
								size="sm"
								className="size-7"
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

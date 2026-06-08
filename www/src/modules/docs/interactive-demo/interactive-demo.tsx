import React, { type ComponentType, createElement, useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { CodeBlock } from "@/modules/docs/code-block";
import { renderCode } from "@/modules/docs/codegen/code-template";
import { DynamicPre } from "@/modules/docs/dynamic-pre";
import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ui/card";

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
	/** SourceFirst engine template; absent ⇒ legacy serialization path. */
	codeTemplate?: CodeTemplate;
}

export function InteractiveDemo({
	component: Playground,
	controls,
	className,
	layout = "horizontal",
	codeTemplate,
}: InteractiveDemoProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	// "horizontal" puts the controls in a column to the right of the preview at md+; below md
	// (and for "vertical") they sit in a wrapping row beneath it. The small↔large switch is pure
	// CSS via md: variants — no JS media query — so SSR and the first client render match exactly
	// (no hydration mismatch, no flash). A side column wouldn't fit on small screens anyway.
	const horizontal = layout === "horizontal";
	const controlListClass = cn(
		"flex-row flex-wrap items-start gap-x-6 gap-y-4",
		horizontal && "md:flex-col md:flex-nowrap",
	);

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

	return (
		<div className={cn("overflow-hidden rounded-lg border", className)}>
			<div className={cn("flex flex-col", horizontal && "md:flex-row")}>
				{/* Preview — borderless open space (no card, no backdrop); the demo just sits in it */}
				<div className="flex min-h-56 flex-1 items-center justify-center p-10">{previewElement}</div>

				{/* Controls — always grouped in a titled card; a fixed-width column to the right at md+
				    when horizontal, otherwise a wrapping row beneath the preview (also on small screens). */}
				<div
					className={cn(
						"**:data-field:gap-1 **:data-label:text-[0.8125rem] **:data-label:text-fg-muted",
						"p-5",
						horizontal && "md:w-64 md:shrink-0",
					)}
				>
					<Card size="sm">
						<CardHeader>
							<CardTitle className="text-xs font-medium text-fg-muted">Props</CardTitle>
						</CardHeader>
						<CardContent className={cn("flex", controlListClass)}>
							<Controls controls={controls} values={values} onChange={handleChange} layout={layout} />
						</CardContent>
					</Card>
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

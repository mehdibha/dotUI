import React, { useState } from "react";
import { flushSync } from "react-dom";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Button } from "@dotui/registry/ui/button";

import { CodeBlock, Pre } from "./code-block";

// ============================================================================
// Slot Components
// ============================================================================

export function DemoCode({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

export function DemoCodePreview({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

// ============================================================================
// Slot Extraction Helper
// ============================================================================

export function getSlotContent(
	children: React.ReactNode,
	SlotComponent: React.ComponentType<{ children: React.ReactNode }>,
): React.ReactNode {
	let content: React.ReactNode = null;
	React.Children.forEach(children, (child) => {
		if (React.isValidElement<{ children: React.ReactNode }>(child) && child.type === SlotComponent) {
			content = child.props.children;
		}
	});
	return content;
}

// ============================================================================
// Demo Component
// ============================================================================

export interface DemoProps extends React.ComponentProps<"div"> {
	component: React.ComponentType;
	children: React.ReactNode;
}

export function Demo({ component: Component, children, ...props }: DemoProps) {
	const [isExpanded, setExpanded] = useState(false);

	const codeContent = getSlotContent(children, DemoCode);
	const previewContent = getSlotContent(children, DemoCodePreview);

	const handleToggle = () => {
		if (document.startViewTransition) {
			document.startViewTransition(() => {
				flushSync(() => {
					setExpanded((prev) => !prev);
				});
			});
		} else {
			setExpanded((prev) => !prev);
		}
	};

	return (
		<div {...props}>
			{/* Preview frame */}
			<div className="flex min-h-56 items-center justify-center rounded-t-lg border bg-bg p-10">
				<Component />
			</div>

			{/* Code block with toggle */}
			<CodeBlock
				actions={
					<Button variant="quiet" size="sm" className="h-7 gap-1 pr-2 pl-1 text-xs" onPress={handleToggle}>
						{isExpanded ? (
							<>
								<ChevronUpIcon /> Code
							</>
						) : (
							<>
								<ChevronDownIcon /> Code
							</>
						)}
					</Button>
				}
				className="rounded-t-none border-t-0"
			>
				<Pre className="[view-transition-name:code-fade]">{isExpanded ? codeContent : previewContent}</Pre>
			</CodeBlock>
		</div>
	);
}

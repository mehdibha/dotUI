"use client";

import { ChevronDownIcon } from "lucide-react";
import {
	Button as AriaButton,
	Disclosure as AriaDisclosure,
	DisclosurePanel as AriaDisclosurePanel,
	Heading as AriaHeading,
	composeRenderProps,
} from "react-aria-components";

import { useStyles } from "./styles";

// MARK: disclosureStyles

// MARK: seperator

interface DisclosureProps extends React.ComponentProps<typeof AriaDisclosure> {}

function Disclosure({ className, ...props }: DisclosureProps) {
	const { root } = useStyles()();
	return (
		<AriaDisclosure
			data-disclosure=""
			className={composeRenderProps(className, (c) => root({ className: c }))}
			{...props}
		/>
	);
}

// MARK: seperator

interface DisclosurePanelProps extends React.ComponentProps<typeof AriaDisclosurePanel> {}

function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
	const { panel } = useStyles()();
	return (
		<AriaDisclosurePanel
			data-disclosure-panel=""
			className={composeRenderProps(className, (c) => panel({ className: c }))}
			{...props}
		>
			<div className="pb-3">{props.children}</div>
		</AriaDisclosurePanel>
	);
}

// MARK: seperator

interface DisclosureTriggerProps extends React.ComponentProps<typeof AriaButton> {}

function DisclosureTrigger(props: DisclosureTriggerProps) {
	const { heading, button } = useStyles()();
	return (
		<AriaHeading className={heading()}>
			<AriaButton slot="trigger" data-disclosure-trigger="" className={button()} {...props}>
				{composeRenderProps(props.children, (children) => (
					<>
						{children}
						<ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200" />
					</>
				))}
			</AriaButton>
		</AriaHeading>
	);
}

// MARK: seperator

export type { DisclosurePanelProps, DisclosureProps, DisclosureTriggerProps };
export { Disclosure, DisclosurePanel, DisclosureTrigger };

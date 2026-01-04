"use client";

import { DisclosureGroup as AriaDisclosureGroup, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";

const accordionStyles = tv({
	base: "**:data-disclosure:not-last:border-b",
});

interface AccordionProps extends React.ComponentProps<typeof AriaDisclosureGroup> {}
function Accordion({ className, ...props }: AccordionProps) {
	return (
		<AriaDisclosureGroup
			data-accordion=""
			className={composeRenderProps(className, (c) => accordionStyles({ className: c }))}
			{...props}
		/>
	);
}

export { Accordion };

export type { AccordionProps };

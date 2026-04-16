import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DisclosureGroupPrimitives from "react-aria-components/DisclosureGroup";

import { useStyles } from "./styles";

interface AccordionProps extends React.ComponentProps<typeof DisclosureGroupPrimitives.DisclosureGroup> {}
function Accordion({ className, ...props }: AccordionProps) {
	const accordionStyles = useStyles();
	return (
		<DisclosureGroupPrimitives.DisclosureGroup
			data-accordion=""
			className={composeRenderProps(className, (c) => accordionStyles({ className: c }))}
			{...props}
		/>
	);
}

export type { AccordionProps };
export { Accordion };

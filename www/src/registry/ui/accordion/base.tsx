import { DisclosureGroup as AriaDisclosureGroup, composeRenderProps } from "react-aria-components";

import { useStyles } from "./styles";

interface AccordionProps extends React.ComponentProps<typeof AriaDisclosureGroup> {}
function Accordion({ className, ...props }: AccordionProps) {
	const accordionStyles = useStyles();
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

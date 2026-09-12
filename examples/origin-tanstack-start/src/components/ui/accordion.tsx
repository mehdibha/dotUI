import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as AccordionPrimitives from "react-aria-components/DisclosureGroup";
import { tv, type VariantProps } from "tailwind-variants";

const accordionVariants = tv({
  base: "flex w-full flex-col **:data-disclosure:not-last:border-b",
});

interface AccordionProps extends React.ComponentProps<
  typeof AccordionPrimitives.DisclosureGroup
> {}
function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitives.DisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (c) =>
        accordionVariants({ className: c }),
      )}
      {...props}
    />
  );
}

export type { AccordionProps };
export { Accordion };

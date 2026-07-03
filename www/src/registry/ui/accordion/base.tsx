import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as AccordionPrimitives from 'react-aria-components/DisclosureGroup'

import { useStyles } from './styles'

interface AccordionProps extends React.ComponentProps<
  typeof AccordionPrimitives.DisclosureGroup
> {}
function Accordion({ className, ...props }: AccordionProps) {
  const styles = useStyles()
  return (
    <AccordionPrimitives.DisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (c) => styles({ className: c }))}
      {...props}
    />
  )
}

export type { AccordionProps }
export { Accordion }

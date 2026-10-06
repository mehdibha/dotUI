import { use } from "react"
import * as ButtonPrimitive from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { SelectStateContext } from "react-aria-components/Select"

import { useComponentParams } from "@/lib/styles"
import { ChevronsUpDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import type { ButtonProps } from "@/registry/ui/button"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"

import { SelectTrigger as ButtonTrigger, SelectValue } from "./base"
import { SelectTrigger as FieldTrigger } from "./base.field"

/* base.field.tsx is base.tsx with a field-shell SelectTrigger; keep the two
   in step. The shipped file takes the up-down caret from `caret.source`
   (meta.ts); live, the trigger picks its build and glyph here. */

const withDoubleCaret = (children: ButtonProps["children"]) =>
  composeRenderProps(children, (children) => (
    <>
      {children ?? <SelectValue />}
      <ChevronsUpDownIcon className="ml-auto" />
    </>
  ))

const FieldDoubleTrigger = ({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof FieldTrigger>) => {
  const { trigger } = useInputStyles()()
  const isInvalid = use(SelectStateContext)?.displayValidation.isInvalid
  return (
    <ButtonPrimitive.Button
      data-select-trigger=""
      data-size={size}
      data-invalid={isInvalid || undefined}
      className={composeRenderProps(className, (className) =>
        trigger({ className, size }),
      )}
      {...props}
    >
      {withDoubleCaret(children)}
    </ButtonPrimitive.Button>
  )
}

const ButtonDoubleTrigger = ({ className, size, ...props }: ButtonProps) => {
  const { buttonTrigger } = useInputStyles()()
  return (
    <Button
      size={size}
      className={composeRenderProps(className, (className) =>
        buttonTrigger({ className, size: size === "xs" ? "sm" : size }),
      )}
      {...props}
    >
      {withDoubleCaret(props.children)}
    </Button>
  )
}

const SelectTrigger = ({
  variant,
  isIconOnly,
  size,
  ...props
}: ButtonProps) => {
  const { trigger, caret } = useComponentParams("select")
  if (trigger === "field") {
    const Field = caret === "double" ? FieldDoubleTrigger : FieldTrigger
    return <Field {...props} size={size === "xs" ? "sm" : size} />
  }
  const Trigger = caret === "double" ? ButtonDoubleTrigger : ButtonTrigger
  return (
    <Trigger variant={variant} isIconOnly={isIconOnly} size={size} {...props} />
  )
}

export * from "./base"
export { SelectTrigger }

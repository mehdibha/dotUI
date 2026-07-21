'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as NumberFieldPrimitives from 'react-aria-components/NumberField'

import { MinusIcon, PlusIcon } from '@/registry/icons'
import { Button, type ButtonProps } from '@/registry/ui/button'
import { fieldStyles } from '@/registry/ui/field'
import { Group } from '@/registry/ui/group'
import { Input } from '@/registry/ui/input'

interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}
const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <NumberFieldPrimitives.NumberField
      data-slot="number-field"
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <Group>
              <Input />
              <Button slot="decrement">
                <MinusIcon />
              </Button>
              <Button slot="increment">
                <PlusIcon />
              </Button>
            </Group>
          ),
      )}
    </NumberFieldPrimitives.NumberField>
  )
}

const NumberFieldDecrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="decrement" isIconOnly {...props}>
      {children ?? <MinusIcon />}
    </Button>
  )
}

const NumberFieldIncrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="increment" isIconOnly {...props}>
      {children ?? <PlusIcon />}
    </Button>
  )
}

export type { NumberFieldProps }
export {
  Group as NumberFieldGroup,
  NumberField,
  NumberFieldDecrement,
  NumberFieldIncrement,
}

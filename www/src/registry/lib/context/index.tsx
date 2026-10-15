import * as React from "react"
import { mergeProps } from "react-aria"
import { useSlottedContext } from "react-aria-components/slots"
import type { ContextValue, SlotProps } from "react-aria-components/slots"

export interface CreateContextOptions {
  strict?: boolean
  name?: string
}

export type CreateContextReturn<T> = [
  React.Context<T>,
  (consumerName: string) => T,
]

export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const { name, strict = true } = options

  const Context = React.createContext<ContextType | undefined>(undefined)

  Context.displayName = name

  function useContext(consumerName?: string) {
    const context = React.useContext(Context)

    if (!context && strict) {
      const error = new Error(
        `\`${consumerName}\` must be used within \`${name}\``,
      )

      error.name = "ContextError"
      throw error
    }

    return context
  }

  return [Context, useContext] as CreateContextReturn<ContextType>
}

export function createVariantsContext<
  TVariants extends object,
  TAriaProps extends SlotProps,
  TAriaElement extends Element = Element,
>(ariaContext: React.Context<ContextValue<TAriaProps, TAriaElement>>) {
  const VariantsContext = React.createContext<Partial<TVariants>>({})

  const Provider = ({
    children,
    ...variants
  }: Partial<TVariants> & { children: React.ReactNode }) => (
    <VariantsContext.Provider value={variants as Partial<TVariants>}>
      {children}
    </VariantsContext.Provider>
  )

  function useContextProps<TProps extends Partial<TVariants> & SlotProps>(
    localProps: TProps,
  ): TProps {
    const contextVariants = React.useContext(VariantsContext)
    const ariaProps = useSlottedContext(ariaContext, localProps.slot) || {}
    return mergeProps(contextVariants, ariaProps, localProps) as TProps
  }

  return [Provider, useContextProps] as const
}

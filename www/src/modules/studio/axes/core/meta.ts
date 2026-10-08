/* Panel-only option metadata: what a row shows for each value. The runtime
   module owns the value list; a `<chapter>.meta.ts` labels it, totally. */

export interface OptionMeta {
  label: string
  description?: string
  /** The systems the option is copied from. */
  credits?: readonly string[]
}

export type Option<V extends string = string> = { value: V } & OptionMeta

/** The values in their runtime order, each with its label. */
export const options = <V extends string>(
  values: readonly V[],
  meta: Record<V, OptionMeta>,
): Option<V>[] => values.map((value) => ({ value, ...meta[value] }))

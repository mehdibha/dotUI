import { cn as cnBase } from 'tailwind-variants'

// Narrowed to `string`: React Aria className render props reject `undefined`.
export const cn = (...classes: Parameters<typeof cnBase>): string =>
  cnBase(...classes) ?? ''

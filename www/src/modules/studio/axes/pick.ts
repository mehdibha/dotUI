/** The option's value when it is one of `options`, else `fallback`. */
export const pick = (
  options: { value: string }[],
  value: string,
  fallback: string,
) => (options.some((o) => o.value === value) ? value : fallback)

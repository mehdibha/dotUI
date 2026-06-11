const plugin = require('tailwindcss/plugin')

/**
 * Tailwind CSS plugin that adds a `with-[value]` variant.
 *
 * This variant matches elements that have a class starting with or containing
 * the specified value followed by a hyphen.
 *
 * Use with Tailwind's built-in `not-*` variant for negation:
 * - `with-[size]:bg-blue-500` - applies when a `size-*` class is present
 * - `not-with-[size]:w-9` - applies when NO `size-*` class is present
 *
 * @example
 * // Apply w-9 only when no `size-*` class is present
 * className="not-with-[size]:w-9"
 *
 * // The class name contains "size]" but checks for "size-"
 * // This avoids the self-referencing selector problem!
 */
const withVariant = plugin(({ matchVariant }) => {
  const selector = (value) =>
    `:is([class^='${value}-'], [class*=' ${value}-'], [class^='-${value}-'], [class*=' -${value}-'])`

  matchVariant('with', (value) => `&${selector(value)}`)
  matchVariant('not-with', (value) => `&:not(${selector(value)})`)
})

module.exports = withVariant

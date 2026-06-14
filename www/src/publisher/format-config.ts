/**
 * Maps `CodeOptions` onto oxfmt's `FormatConfig`.
 *
 * Kept SEPARATE from `code-options.ts` because this is the only piece that
 * imports `oxfmt`. The create codec imports `code-options.ts` transitively into
 * the `/create` and "Open in v0" showcase bundles; isolating the oxfmt type
 * here keeps `oxfmt` out of those bundles. Only the `/r/*` route handlers
 * (which already import `oxfmt`'s `format`) import this module.
 */

import type { FormatConfig } from 'oxfmt'

import type { CodeOptions } from './code-options'

/**
 * Tailwind sorting names `cn`/`tv` so classes inside the generated `tv(...)`
 * config get sorted too, not just `className` attributes.
 */
export function codeOptionsToFormatConfig(opts: CodeOptions): FormatConfig {
  return {
    semi: opts.semicolons,
    singleQuote: opts.quoteStyle === 'single',
    jsxSingleQuote: opts.jsxQuoteStyle === 'single',
    useTabs: opts.indentStyle === 'tab',
    tabWidth: opts.indentWidth,
    printWidth: opts.printWidth,
    trailingComma: opts.trailingComma,
    arrowParens: opts.arrowParens,
    bracketSpacing: opts.bracketSpacing,
    objectWrap: opts.objectWrap,
    quoteProps: opts.quoteProps,
    endOfLine: opts.endOfLine,
    bracketSameLine: opts.jsxBracketSameLine,
    singleAttributePerLine: opts.singleAttributePerLine,
    sortImports: opts.sortImports,
    sortTailwindcss: opts.sortClasses ? { functions: ['cn', 'tv'] } : false,
  }
}

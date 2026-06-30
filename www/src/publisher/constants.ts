/**
 * Shared publisher constants — deliberately import-free.
 *
 * `TV_CONFIG_PLACEHOLDER` is used by BOTH the build-time transform
 * (`build-time/transform-base.ts`) and the request-time publisher
 * (`publish.ts`). Keeping it here, with no imports of its own, prevents the
 * build-time side — which is pulled into the docs codegen and thus the Vite
 * config graph — from transitively importing the request-time modules
 * (`emit-stylex` → `tw-to-stylex` → `@/registry/theme`). That value import of
 * `@/registry` can't be resolved while Vite is bundling its own config, so the
 * two sides must not reach each other through this constant.
 */

/** Sentinel spliced into the transformed template where the resolved style config goes. */
export const TV_CONFIG_PLACEHOLDER = '%%TV_CONFIG%%'

import { Link } from "@tanstack/react-router"
import type { ToOptions } from "@tanstack/react-router"

type RouterHref = string | ToOptions

type LinkDOMProps = React.ComponentProps<"a"> & { "data-disabled"?: boolean }

/**
 * `href` and `render` for a React Aria link (Link, LinkButton, MenuItem, Tab…)
 * so internal hrefs navigate through TanStack Router. `fallback` is the element
 * the component renders when it isn't an enabled link.
 */
function routerLinkProps(
  href: RouterHref | undefined,
  fallback: "span" | "div" = "span",
) {
  // href={undefined} still counts as a link prop to react-aria ('href' in props).
  if (href === undefined) return {}
  const Fallback = fallback
  return {
    // ToOptions.to defaults to the current route, so hash/search-only objects have no `.to`.
    href: typeof href === "object" ? (href.to ?? "#") : href,
    render: (domProps: object) => {
      const props = domProps as LinkDOMProps
      // isDisabled can come from context, so read it off the resolved DOM props.
      if (!props.href || props["data-disabled"]) {
        return <Fallback {...(domProps as React.HTMLAttributes<HTMLElement>)} />
      }
      if (typeof href === "string" && !href.startsWith("/")) {
        return <a {...props} />
      }
      // RouterLink treats a literal `href` as authoritative and drops the ToOptions fields.
      const { href: _href, ...rest } = props
      const to = typeof href === "object" ? href : ({ to: href } as ToOptions)
      return <Link {...to} {...rest} />
    },
  }
}

export type { RouterHref }
export { routerLinkProps }

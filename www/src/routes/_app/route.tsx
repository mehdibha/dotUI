import { createFileRoute, Outlet } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { setResponseHeader } from "@tanstack/react-start/server"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import type * as PageTree from "fumadocs-core/page-tree"

import type { SerializedPageTree } from "@/lib/source"
import {
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
} from "@/registry/ui/drawer"
import { Header } from "@/components/layout/header"

const getPageTree = createServerFn({ method: "GET" }).handler(
  async (): Promise<SerializedPageTree> => {
    const { getSerializedPageTree } = await import("@/lib/source")
    // The page tree is baked into the build, so let Vercel's CDN cache it
    // until the next deploy purge. During document SSR this header lands on
    // the HTML response itself (h3 merges it into 2xx documents only) —
    // harmless while nothing under _app renders per-request content, but
    // revisit if auth/per-user SSR ever lands here.
    setResponseHeader(
      "Cache-Control",
      "public, max-age=0, must-revalidate, s-maxage=31536000",
    )
    return getSerializedPageTree()
  },
)

export const Route = createFileRoute("/_app")({
  component: AppLayout,
  loader: async () => {
    const pageTree = await getPageTree()
    return { pageTree }
  },
  // The page tree only changes with a build/deploy (Vercel purges the CDN
  // cache on deploy), so never background-revalidate it on re-match.
  staleTime: Infinity,
})

function AppLayout() {
  const { pageTree } = Route.useLoaderData()
  const items = pageTree.children as PageTree.Node[]

  return (
    <DrawerProvider>
      <DrawerIndentBackground />
      {/* The mobile menu (a left drawer in the header) pushes the page aside
          Claude-app style: the page slides right by the menu width, follows
          the finger 1:1 while swiping (transition off whenever swipe progress
          is non-zero), and rounds its corner over the dark layer above. The
          hairline is an inset spread shadow, not a border, so nothing shifts;
          inset because the sidebar is opaque and would cover a line drawn
          outside the box. Active-only, since inset it would otherwise show
          along the viewport edges.
          Page drawers (docs demos, studio) live under their own provider
          below so they never trigger the push. */}
      <DrawerIndent className="origin-left transition-[transform,border-radius,box-shadow] duration-[calc(500ms*(1-clamp(0,calc(var(--drawer-swipe-progress,0)*100000),1)))] [--header-height:--spacing(14)] data-active:transform-[translate3d(calc(var(--mobile-menu-width)*(1-var(--drawer-swipe-progress,0))),0,0)] data-active:rounded-3xl data-active:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-fg)_25%,var(--color-bg))]">
        <Header items={items} />
        <DrawerProvider>
          <main id="content">
            <Outlet />
          </main>
        </DrawerProvider>
        {/* Not on the root: the /preview iframe renders outside _app. */}
        <Analytics />
        <SpeedInsights />
      </DrawerIndent>
    </DrawerProvider>
  )
}

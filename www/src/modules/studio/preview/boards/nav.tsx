import BreadcrumbsDemo from "@/registry/ui/breadcrumbs/demos/basic"
import LinkDemo from "@/registry/ui/link/demos/default"
import SidebarDemo from "@/registry/ui/sidebar/demos/basic"
import TabsDemo from "@/registry/ui/tabs/demos/basic"

import { Board, BoardSection } from "./board"

export default function NavBoard() {
  return (
    <Board id="nav">
      <BoardSection
        member="tabs"
        title="Tabs"
        axes={[
          "tabStyle",
          "tabsColor",
          "tabIndicator",
          "tabsPill",
          "navWeight",
          "navCase",
          "segmentedSelected",
          "paginationCurrent",
          "navMotion",
          "motion",
        ]}
      >
        <TabsDemo />
      </BoardSection>
      <BoardSection
        member="sidebar"
        title="Sidebar"
        axes={["navMarker", "shellTone", "navItemWeight"]}
      >
        <SidebarDemo />
      </BoardSection>
      <BoardSection
        member="link"
        title="Links"
        axes={["linkUnderline", "linkColor"]}
      >
        <LinkDemo />
      </BoardSection>
      <BoardSection
        member="breadcrumbs"
        title="Breadcrumbs"
        axes={["breadcrumbSeparator", "breadcrumbTone"]}
      >
        <BreadcrumbsDemo />
      </BoardSection>
    </Board>
  )
}

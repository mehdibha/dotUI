import BreadcrumbsDemo from "@/registry/ui/breadcrumbs/demos/basic"
import TabsDemo from "@/registry/ui/tabs/demos/basic"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function NavigationGroupExamples() {
  return (
    <Examples>
      <Example title="Breadcrumbs">
        <BreadcrumbsDemo />
      </Example>
      <Example title="Tabs">
        <TabsDemo />
      </Example>
    </Examples>
  )
}

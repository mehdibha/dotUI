import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Card from "./demos/card"

export default function SkeletonExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="card">
        <Card />
      </Example>
    </Examples>
  )
}

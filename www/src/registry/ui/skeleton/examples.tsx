import { Example } from "@/registry/ui/example";

import ApiSimulation from "./demos/api-simulation";
import Card from "./demos/card";
import Children from "./demos/children";
import FixedSizeChildren from "./demos/fixed-size-children";
import Show from "./demos/show";

export default function Examples() {
  return (
    <>
      <Example title="api simulation">
        <ApiSimulation />
      </Example>
      <Example title="card">
        <Card />
      </Example>
      <Example title="children">
        <Children />
      </Example>
      <Example title="fixed size children">
        <FixedSizeChildren />
      </Example>
      <Example title="show">
        <Show />
      </Example>
    </>
  );
}

import { Example } from "@dotui/registry/ui/example";

import Card from "./demos/card";
import Composition from "./demos/composition";
import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Label from "./demos/label";
import Sizes from "./demos/sizes";
import Uncontrolled from "./demos/uncontrolled";

export default function Examples() {
  return (
    <>
      <Example title="card">
        <Card />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="default">
        <Default />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
    </>
  );
}

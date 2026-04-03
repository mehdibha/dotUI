import { Example } from "@dotui/registry/ui/example";

import Channel from "./demos/channel";
import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Disabled from "./demos/disabled";
import Label from "./demos/label";
import Uncontrolled from "./demos/uncontrolled";
import Vertical from "./demos/vertical";

export default function Examples() {
  return (
    <>
      <Example title="channel">
        <Channel />
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
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
      <Example title="vertical">
        <Vertical />
      </Example>
    </>
  );
}

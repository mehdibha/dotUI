import { Example } from "@dotui/registry/ui/example";

import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import Disabled from "./demos/disabled";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
    </>
  );
}

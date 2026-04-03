import { Example } from "@dotui/registry/ui/example";

import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import Disabled from "./demos/disabled";
import KeyboardActivation from "./demos/keyboard-activation";
import Variant from "./demos/variant";
import Vertical from "./demos/vertical";

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
      <Example title="keyboard activation">
        <KeyboardActivation />
      </Example>
      <Example title="variant">
        <Variant />
      </Example>
      <Example title="vertical">
        <Vertical />
      </Example>
    </>
  );
}

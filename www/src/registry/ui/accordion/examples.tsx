import { Example } from "@/registry/ui/example";

import AllowsMultiple from "./demos/allows-multiple";
import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import DefaultExpanded from "./demos/default-expanded";
import Disabled from "./demos/disabled";

export default function Examples() {
  return (
    <>
      <Example title="allows multiple">
        <AllowsMultiple />
      </Example>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="default expanded">
        <DefaultExpanded />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
    </>
  );
}

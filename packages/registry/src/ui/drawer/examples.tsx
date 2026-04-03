import { Example } from "@dotui/registry/ui/example";

import Basic from "./demos/basic";
import Placement from "./demos/placement";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="placement">
        <Placement />
      </Example>
    </>
  );
}

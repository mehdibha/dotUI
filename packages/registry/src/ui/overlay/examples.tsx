import { Example } from "@dotui/registry/ui/example";

import Basic from "./demos/basic";
import Type from "./demos/type";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="type">
        <Type />
      </Example>
    </>
  );
}

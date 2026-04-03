import { Example } from "@/registry/ui/example";

import Basic from "./demos/basic";
import Dialog from "./demos/dialog";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="dialog">
        <Dialog />
      </Example>
    </>
  );
}

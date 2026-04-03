import { Example } from "@/registry/ui/example";

import Action from "./demos/action";
import CustomIcon from "./demos/custom-icon";
import Danger from "./demos/danger";
import Default from "./demos/default";
import Success from "./demos/success";
import Warning from "./demos/warning";

export default function Examples() {
  return (
    <>
      <Example title="action">
        <Action />
      </Example>
      <Example title="custom icon">
        <CustomIcon />
      </Example>
      <Example title="danger">
        <Danger />
      </Example>
      <Example title="default">
        <Default />
      </Example>
      <Example title="success">
        <Success />
      </Example>
      <Example title="warning">
        <Warning />
      </Example>
    </>
  );
}

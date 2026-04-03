import { Example } from "@dotui/registry/ui/example";

import Basic from "./demos/basic";
import Composition from "./demos/composition";
import Disabled from "./demos/disabled";
import Icon from "./demos/icon";
import RouterIntegration from "./demos/router-integration";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="icon">
        <Icon />
      </Example>
      <Example title="router integration">
        <RouterIntegration />
      </Example>
    </>
  );
}

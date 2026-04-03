import { Example } from "@dotui/registry/ui/example";

import Default from "./demos/default";
import Disabled from "./demos/disabled";
import LinkButton from "./demos/link-button";
import Loading from "./demos/loading";
import PrefixAndSuffix from "./demos/prefix-and-suffix";
import Shapes from "./demos/shapes";
import Sizes from "./demos/sizes";
import Variants from "./demos/variants";

export default function Examples() {
  return (
    <>
      <Example title="default">
        <Default />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="link button">
        <LinkButton />
      </Example>
      <Example title="loading">
        <Loading />
      </Example>
      <Example title="prefix and suffix">
        <PrefixAndSuffix />
      </Example>
      <Example title="shapes">
        <Shapes />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="variants">
        <Variants />
      </Example>
    </>
  );
}

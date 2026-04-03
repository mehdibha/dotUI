import { Example } from "@/registry/ui/example";

import AsyncLoading from "./demos/async-loading";
import Basic from "./demos/basic";
import Composition from "./demos/composition";
import Controlled from "./demos/controlled";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import Label from "./demos/label";
import Links from "./demos/links";
import Loading from "./demos/loading";
import Placeholder from "./demos/placeholder";
import Required from "./demos/required";
import Sections from "./demos/sections";
import Uncontrolled from "./demos/uncontrolled";
import Validation from "./demos/validation";

export default function Examples() {
  return (
    <>
      <Example title="async loading">
        <AsyncLoading />
      </Example>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="composition">
        <Composition />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="links">
        <Links />
      </Example>
      <Example title="loading">
        <Loading />
      </Example>
      <Example title="placeholder">
        <Placeholder />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="sections">
        <Sections />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
      <Example title="validation">
        <Validation />
      </Example>
    </>
  );
}

import { Example } from "@/registry/ui/example";

import AsyncLoading from "./demos/async-loading";
import Basic from "./demos/basic";
import Composition from "./demos/composition";
import Controlled from "./demos/controlled";
import DisabledItems from "./demos/disabled-items";
import EmptyState from "./demos/empty-state";
import Grid from "./demos/grid";
import Horizontal from "./demos/horizontal";
import ItemVariant from "./demos/item-variant";
import LabelAndDescription from "./demos/label-and-description";
import Links from "./demos/links";
import Loading from "./demos/loading";
import PrefixAndSuffix from "./demos/prefix-and-suffix";
import Sections from "./demos/sections";
import SelectionBehavior from "./demos/selection-behavior";
import SelectionMode from "./demos/selection-mode";
import Separator from "./demos/separator";
import Uncontrolled from "./demos/uncontrolled";

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
      <Example title="disabled items">
        <DisabledItems />
      </Example>
      <Example title="empty state">
        <EmptyState />
      </Example>
      <Example title="grid">
        <Grid />
      </Example>
      <Example title="horizontal">
        <Horizontal />
      </Example>
      <Example title="item variant">
        <ItemVariant />
      </Example>
      <Example title="label and description">
        <LabelAndDescription />
      </Example>
      <Example title="links">
        <Links />
      </Example>
      <Example title="loading">
        <Loading />
      </Example>
      <Example title="prefix and suffix">
        <PrefixAndSuffix />
      </Example>
      <Example title="sections">
        <Sections />
      </Example>
      <Example title="selection behavior">
        <SelectionBehavior />
      </Example>
      <Example title="selection mode">
        <SelectionMode />
      </Example>
      <Example title="separator">
        <Separator />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
    </>
  );
}

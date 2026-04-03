import { Example } from "@/registry/ui/example";

import Basic from "./demos/basic";
import Controlled from "./demos/controlled";
import DisabledItems from "./demos/disabled-items";
import ItemVariant from "./demos/item-variant";
import LabelAndDescription from "./demos/label-and-description";
import LinkItems from "./demos/link-items";
import LongPress from "./demos/long-press";
import MultipleSelection from "./demos/multiple-selection";
import OverlayType from "./demos/overlay-type";
import Placement from "./demos/placement";
import PrefixAndSuffix from "./demos/prefix-and-suffix";
import Section from "./demos/section";
import Separator from "./demos/separator";
import Shortcut from "./demos/shortcut";
import SingleSelection from "./demos/single-selection";
import Submenus from "./demos/submenus";

export default function Examples() {
  return (
    <>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="disabled items">
        <DisabledItems />
      </Example>
      <Example title="item variant">
        <ItemVariant />
      </Example>
      <Example title="label and description">
        <LabelAndDescription />
      </Example>
      <Example title="link items">
        <LinkItems />
      </Example>
      <Example title="long press">
        <LongPress />
      </Example>
      <Example title="multiple selection">
        <MultipleSelection />
      </Example>
      <Example title="overlay type">
        <OverlayType />
      </Example>
      <Example title="placement">
        <Placement />
      </Example>
      <Example title="prefix and suffix">
        <PrefixAndSuffix />
      </Example>
      <Example title="section">
        <Section />
      </Example>
      <Example title="separator">
        <Separator />
      </Example>
      <Example title="shortcut">
        <Shortcut />
      </Example>
      <Example title="single selection">
        <SingleSelection />
      </Example>
      <Example title="submenus">
        <Submenus />
      </Example>
    </>
  );
}

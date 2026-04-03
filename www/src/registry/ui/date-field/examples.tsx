import { Example } from "@/registry/ui/example";

import Controlled from "./demos/controlled";
import Default from "./demos/default";
import Description from "./demos/description";
import Disabled from "./demos/disabled";
import ErrorMessage from "./demos/error-message";
import Granularity from "./demos/granularity";
import HideTimeZone from "./demos/hide-time-zone";
import HourCycle from "./demos/hour-cycle";
import Label from "./demos/label";
import Placeholder from "./demos/placeholder";
import PrefixAndSuffix from "./demos/prefix-and-suffix";
import ReadOnly from "./demos/read-only";
import Required from "./demos/required";
import Sizes from "./demos/sizes";
import TimeZones from "./demos/time-zones";
import Uncontrolled from "./demos/uncontrolled";

export default function Examples() {
  return (
    <>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="default">
        <Default />
      </Example>
      <Example title="description">
        <Description />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="error message">
        <ErrorMessage />
      </Example>
      <Example title="granularity">
        <Granularity />
      </Example>
      <Example title="hide time zone">
        <HideTimeZone />
      </Example>
      <Example title="hour cycle">
        <HourCycle />
      </Example>
      <Example title="label">
        <Label />
      </Example>
      <Example title="placeholder">
        <Placeholder />
      </Example>
      <Example title="prefix and suffix">
        <PrefixAndSuffix />
      </Example>
      <Example title="read only">
        <ReadOnly />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="time zones">
        <TimeZones />
      </Example>
      <Example title="uncontrolled">
        <Uncontrolled />
      </Example>
    </>
  );
}

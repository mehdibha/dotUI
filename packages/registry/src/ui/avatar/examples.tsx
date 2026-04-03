import { Example } from "@dotui/registry/ui/example";

import AvatarGroupCount from "./demos/avatar-group-count";
import Badge from "./demos/badge";
import BadgeNotification from "./demos/badge-notification";
import BadgeTopRight from "./demos/badge-top-right";
import BadgeWithIcon from "./demos/badge-with-icon";
import Basic from "./demos/basic";
import Default from "./demos/default";
import FallbackOnly from "./demos/fallback-only";
import Group from "./demos/group";
import IconFallback from "./demos/icon-fallback";
import Radii from "./demos/radii";
import Sizes from "./demos/sizes";

export default function Examples() {
  return (
    <>
      <Example title="avatar group count">
        <AvatarGroupCount />
      </Example>
      <Example title="badge">
        <Badge />
      </Example>
      <Example title="badge notification">
        <BadgeNotification />
      </Example>
      <Example title="badge top right">
        <BadgeTopRight />
      </Example>
      <Example title="badge with icon">
        <BadgeWithIcon />
      </Example>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="default">
        <Default />
      </Example>
      <Example title="fallback only">
        <FallbackOnly />
      </Example>
      <Example title="group">
        <Group />
      </Example>
      <Example title="icon fallback">
        <IconFallback />
      </Example>
      <Example title="radii">
        <Radii />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
    </>
  );
}

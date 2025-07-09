import {
  BookmarkIcon,
  CloudDownloadIcon,
  HeartIcon,
  LayoutGridIcon,
  ListIcon,
  SquareArrowOutUpRightIcon,
  UserRoundPlusIcon,
} from "lucide-react";

import { StyleProvider } from "@dotui/ui";
import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import { TextField } from "@dotui/ui/components/text-field";
import { ToggleButton } from "@dotui/ui/components/toggle-button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import type { RouterOutputs } from "@dotui/api";

import { AdobeIcon, MotionIcon } from "@/components/icons";
import { Link } from "@/components/link";

const keywords = ["react-aria-components", "motion"];

const icons = {
  "react-aria-components": {
    label: "React Aria Components",
    href: "https://react-spectrum.adobe.com/react-aria/index.html",
    icon: <AdobeIcon height={18} fill="#E1251B" />,
  },
  motion: {
    label: "Motion",
    href: "https://motion.dev",
    icon: <MotionIcon height={12} />,
  },
} as const;

export function StyleCard(props: {
  style: RouterOutputs["style"]["all"][number];
}) {
  return (
    <StyleProvider mode="dark" style={props.style}>
      <div
        key={props.style.name}
        className="flex items-end justify-between gap-4 rounded-sm border p-6"
      >
        <div>
          <h2 className="font-heading text-2xl font-medium tracking-tight">
            {props.style.name}
          </h2>
          <p className="mt-0.5 text-sm text-fg-muted">
            {props.style.description}
          </p>
          <div className="mt-2 flex items-center gap-4">
            {keywords.map((keyword) => {
              const icon = icons[keyword as keyof typeof icons];
              if (icon) {
                return (
                  <Tooltip
                    key={keyword}
                    content={icon.label}
                    delay={0}
                    className="text-xs"
                  >
                    <Link href={icon.href}>{icon.icon}</Link>
                  </Tooltip>
                );
              }
              return null;
            })}
          </div>
          <div className="mt-8 flex items-center gap-2">
            {/* <Tooltip content="@mehdibha">
              <Link>
                <Avatar src="https://github.com/mehdibha.png" size="sm" />
              </Link>
            </Tooltip> */}
            <Button
              href={`/style/${props.style.slug}`}
              variant="default"
              suffix={<SquareArrowOutUpRightIcon />}
              className="h-8 text-sm"
            >
              Explore style
            </Button>
            {/* <ToggleButton variant="primary" shape="square" className="size-8">
              <HeartIcon />
            </ToggleButton> */}
          </div>
        </div>
        <div className="space-y-2">
          <TextField placeholder="Email" className="w-full" />
          <div className="flex items-center gap-2">
            <Button variant="accent" prefix={<UserRoundPlusIcon />}>
              Invite
            </Button>
            <div className="flex items-center">
              <ToggleButton
                variant="accent"
                className="rounded-r-none border-r-0"
              >
                <ListIcon />
              </ToggleButton>
              <ToggleButton variant="accent" className="rounded-l-none">
                <LayoutGridIcon />
              </ToggleButton>
            </div>
            <Button shape="square">
              <CloudDownloadIcon />
            </Button>
          </div>
          <TextField placeholder="Email" className="w-full" />
        </div>
      </div>
    </StyleProvider>
  );
}

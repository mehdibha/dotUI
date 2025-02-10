import { Container, Item } from "@/components/fade-in";
import { DiscordIcon, GitHubIcon, TwitterIcon } from "@/components/icons";
import { Badge } from "@/registry/ui/default/core/badge";
import { Button } from "@/registry/ui/default/core/button";
import { Link } from "@/registry/ui/default/core/link";
import { siteConfig } from "@/config";

export default function Page() {
  return (
    <Container>
      <div className="container flex max-w-2xl flex-col items-center py-8 text-center">
        <Item className="mt-20 flex items-center gap-2">
          <Logo size={30} className="mb-2 rounded-sm" />
          <span className="font-josephin text-2xl font-bold leading-normal tracking-tighter">
            dotUI.
          </span>
        </Item>
        <Item>
          <Badge variant="outline" className="bg-bg-inverse/5 mt-2">
            status: beta
          </Badge>
        </Item>
        <Item>
          <p className="text-fg-muted mt-14 text-sm font-medium">
            Coming soon.
          </p>
        </Item>
        <Item>
          <h1 className="font-heading mt-6 text-balance text-xl font-bold tracking-tighter lg:text-2xl">
            Who said your component library should be minimalist?
          </h1>
        </Item>
        <Item>
          <p className="text-fg-muted mt-3 text-balance text-sm">
            We&apos;re working hard to make your component library have a{" "}
            <span className="font-bold">unique</span> look, we&apos; re highly
            open to contributions and feedback.
          </p>
        </Item>
        <Item className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="quiet"
            shape="square"
            size="lg"
            href={siteConfig.links.discord}
            target="_blank"
            className="bg-bg-inverse/5"
          >
            <DiscordIcon />
          </Button>
          <Button
            variant="quiet"
            shape="square"
            size="lg"
            href={siteConfig.links.github}
            target="_blank"
            className="bg-bg-inverse/5"
          >
            <GitHubIcon />
          </Button>
          <Button
            variant="quiet"
            shape="square"
            size="lg"
            href={siteConfig.links.twitter}
            target="_blank"
            className="bg-bg-inverse/5"
          >
            <TwitterIcon />
          </Button>
        </Item>
        <Item>
          <p className="text-fg-muted mt-10">
            I dont&apos;t care, i want see the{" "}
            <Link href="https://next.dotui.org">beta version</Link>!
          </p>
        </Item>
      </div>
    </Container>
  );
}

interface IconProps extends Partial<React.SVGProps<SVGSVGElement>> {
  size?: string | number;
}

const Logo = ({ color = "currentColor", size = 16, ...rest }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 300"
      width={size}
      height={size}
      fill={color}
      {...rest}
    >
      <defs>
        <clipPath id="a">
          <path d="M24 0h252c13.254 0 24 10.746 24 24v252c0 13.254-10.746 24-24 24H24c-13.254 0-24-10.746-24-24V24C0 10.746 10.746 0 24 0Zm0 0" />
        </clipPath>
        <clipPath id="b">
          <path d="M187.5 194.418h66.145v66.144H187.5Zm0 0" />
        </clipPath>
        <clipPath id="c">
          <path d="M220.57 194.418c-18.261 0-33.07 14.809-33.07 33.074 0 18.266 14.809 33.07 33.07 33.07 18.266 0 33.075-14.804 33.075-33.07 0-18.265-14.81-33.074-33.075-33.074Zm0 0" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path
          d="M-30-30h360v360H-30z"
          className="fill-[#381e1e] dark:fill-white"
        />
      </g>
      <g clipPath="url(#b)">
        <g clipPath="url(#c)">
          <path
            d="M187.5 194.418h66.145v66.144H187.5Zm0 0"
            className="fill-[#fff] dark:fill-[#381e1e]"
          />
        </g>
      </g>
    </svg>
  );
};

import type { Metadata } from "next";

import { Alert } from "@dotui/ui/components/alert";
import { Avatar } from "@dotui/ui/components/avatar";
import { Button } from "@dotui/ui/components/button";
import { Tooltip } from "@dotui/ui/components/tooltip";
import {
  AdobeIcon,
  GitHubIcon,
  ReactJsIcon,
  ShadcnIcon,
  TailwindExtendedIcon,
  TypescriptIcon,
} from "@dotui/ui/icons";

import { Announcement } from "@/components/announcement";
import { Link } from "@/components/link";
import { StylesShowcase } from "@/components/styles-showcase";
import { siteConfig } from "@/config";
import { getGitHubContributors } from "@/lib/github";
import { caller } from "@/lib/trpc/server";

export const dynamic = "force-static";
export const revalidate = 60;

export default async function HomePage() {
  const contributors = await getGitHubContributors();
  const feturedStyles = await caller.style.getFeatured({ limit: 6 });

  return (
    <div>
      {/* Hero section */}
      <div className="container">
        <section className="max-w-3xl pb-20 pt-10 sm:pt-14">
          <Announcement />
          <h1 className="xs:text-3xl text-balance text-2xl tracking-tighter max-lg:font-medium md:text-4xl lg:text-5xl">
            Quickly build your component library with a{" "}
            <span className="font-bold italic">unique</span> look.
          </h1>
          <p className="text-balace text-fg-muted mt-2 text-lg">
            Over 40 components available in differents styles ready to match
            your brand identity.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button href="/docs" variant="primary" size="lg" className="h-10">
              Get started
            </Button>
            <Button href="/styles" variant="default" size="lg" className="h-10">
              Explore styles
            </Button>
          </div>
        </section>
      </div>
      {/* Components overview */}
      <section className="container">
        {feturedStyles.length > 0 ? (
          <StylesShowcase styles={feturedStyles} />
        ) : (
          <Alert>No styles found.</Alert>
        )}
      </section>
      <section className="shadow-xs mt-10 border-y py-12">
        <div className="container flex flex-col items-center justify-center gap-5 lg:gap-10">
          <h2 className="text-fg-muted xs:text-base text-pretty font-mono text-sm tracking-wide lg:text-base">
            Built on modern tools
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {[
              {
                label: "Shadcn CLI",
                icon: <ShadcnIcon className="size-7 sm:size-9" />,
                href: "https://ui.shadcn.com/docs/cli",
              },
              {
                label: "React 19",
                icon: <ReactJsIcon className="size-7 sm:size-9" />,
                href: "https://react.dev",
              },
              {
                label: "react-aria-components",
                icon: <AdobeIcon className="size-7 sm:size-9" />,
                href: "https://react-spectrum.adobe.com/react-aria/index.html",
              },
              {
                label: "TypeScript 5",
                icon: <TypescriptIcon className="size-7 sm:size-9" />,
                href: "https://www.typescriptlang.org/",
              },
              {
                label: "Tailwind CSS v4",
                icon: <TailwindExtendedIcon className="h-5 sm:h-7" />,
                href: "https://tailwindcss.com",
              },
            ].map(({ icon, label, href }, index) => (
              <Tooltip
                key={index}
                content={label}
                delay={0}
                closeDelay={0}
                offset={10}
                placement="top"
              >
                <Link
                  target="_blank"
                  className="grayscale-80 flex items-center justify-center opacity-60 transition-opacity hover:opacity-100 hover:grayscale-0"
                  href={href}
                >
                  {icon}
                </Link>
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
      {/* Call to action */}
      <section className="container max-w-2xl py-20 sm:py-32">
        <h2 className="text-pretty text-2xl font-medium tracking-tighter lg:text-3xl xl:text-4xl">
          Fueled by your <span className="">stars</span>.
        </h2>
        <p className="text-fg-muted mt-2 text-base">
          Our contributors are working hard to make the web a more singular
          place.
        </p>
        <div className="mt-6 flex items-end justify-between gap-6 px-8 sm:items-end sm:justify-between sm:gap-10 lg:gap-20">
          <div className="flex flex-col items-center gap-6">
            <svg
              width="40"
              viewBox="0 0 236 66"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="-rotate-110 text-fg-muted"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23.9244 0.127533C18.3186 0.573079 9.85122 2.47255 4.6676 4.44233C1.59496 5.61482 0 7.46734 0 9.81232C0 11.2897 0.422197 12.298 1.43077 13.2594C2.39244 14.174 3.02573 14.4085 5.74654 14.9713C10.4611 15.9327 20.4765 20.4351 27.5365 24.7968C31.5708 27.2825 32.8374 27.8218 32.8374 27.0479C32.8374 26.6727 31.0313 24.5154 27.513 20.6931C26.3168 19.3799 25.3317 18.2308 25.3317 18.1605C25.3317 17.9963 26.7625 18.0901 34.362 18.7467C54.9088 20.5055 75.5964 24.7733 95.463 31.3861C103.156 33.9422 107.894 35.7244 116.221 39.1949C123.633 42.2669 125.322 42.8766 126.846 42.8766C127.925 42.8766 128.183 42.7828 128.957 42.0793C129.731 41.3523 129.825 41.1413 129.802 40.2033C129.778 39.0777 129.848 39.1949 127.034 35.7244C125.298 33.5904 124.078 31.4096 124.078 30.4247C124.078 29.4398 124.829 29.0412 126.893 29.0412C131.584 29.0412 140.802 32.5587 157.338 40.6723C166.72 45.2685 169.605 46.5816 170.708 46.7692C172.514 47.0506 173.944 46.1361 174.367 44.4477C174.46 44.049 174.226 42.0089 173.804 39.4294C173.053 34.974 173.03 33.8249 173.71 32.5117C174.179 31.6207 174.718 31.3861 176.313 31.3861C180.911 31.3861 190.762 36.0761 205.562 45.2919C214.85 51.0605 219.541 54.3435 227.845 60.886C230.542 63.0199 233.052 64.9194 233.427 65.107C234.318 65.5291 235.35 65.1539 235.726 64.2159C236.218 63.0434 235.515 62.1523 231.175 58.2596C224.537 52.3034 220.104 48.8328 212.974 44.0022C198.854 34.4112 187.22 28.1266 180.488 26.4617C171.599 24.234 166.908 28.9943 168.855 38.1632C169.136 39.4998 169.347 40.6019 169.3 40.6488C169.253 40.6957 167.424 39.7343 165.242 38.5149C159.59 35.3492 148.777 30.0261 144.367 28.2204C137.542 25.383 133.39 24.1167 129.567 23.6477C124.782 23.0615 120.889 24.703 119.716 27.7749C119.223 29.0881 119.364 31.5503 120.044 33.098C120.302 33.7077 120.49 34.2001 120.443 34.2001C120.396 34.2001 118.262 33.1683 115.681 31.902C90.4436 19.4267 60.1159 11.8525 28.9907 10.2579C22.7516 9.9296 22.9158 10.0468 26.6452 8.63983C29.366 7.63148 30.7264 6.0838 30.7264 4.06711C30.703 3.26982 29.882 1.72214 29.1315 1.089C28.4043 0.479303 26.5279 -0.0835156 25.4959 0.0102836C25.2144 0.0337334 24.5108 0.080633 23.9244 0.127533Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex items-center gap-1">
              {contributors.map((contributor) => (
                <Tooltip
                  key={contributor.login}
                  variant="inverse"
                  content={contributor.login}
                >
                  <Link
                    href={contributor.html_url}
                    target="_blank"
                    variant="unstyled"
                  >
                    <Avatar src={contributor.avatar_url} />
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
          <Button
            href={siteConfig.links.github}
            target="_blank"
            prefix={<GitHubIcon />}
            size="lg"
            className="h-12"
          >
            Star on GitHub
          </Button>
        </div>
      </section>
    </div>
  );
}

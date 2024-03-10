// This file is autogenerated by scripts/build-preview-imports.ts
// Do not edit this file directly.
import React from "react";

export const allPreviews = {
  "components/animations/sparkle-button": {
    component: React.lazy<React.FC>(
      () => import("~/content/components/animations/sparkle-button")
    ),
    code: `import { Button } from "@/components/animations/sparkle-button";

export default function Demo() {
  return <Button variant="sparkle">Get started</Button>;
}
`,
  },
  "components/marketing/hero/hero-simple": {
    component: React.lazy<React.FC>(
      () => import("~/content/components/marketing/hero/hero-simple")
    ),
    code: `import React from "react";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon, SparklesIcon } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/classes";

export default function Demo() {
  return (
    <section>
      <Link
        href="https://github.com/mehdibha/rcopy"
        target="_blank"
        className={cn(
          badgeVariants({ variant: "outline", size: "md" }),
          "cursor-pointer space-x-2 font-mono delay-75 duration-200 hover:bg-secondary"
        )}
      >
        <SparklesIcon size={18} />
        <span>Star us on GitHub</span> <ArrowRightIcon size={15} />
      </Link>
      <h1 className="font-display mt-4 max-w-2xl text-5xl font-bold leading-tight">
        Copy and paste components for you React App
      </h1>
      <h2 className="text-md mt-6 text-muted-foreground md:text-lg lg:text-xl">
        Copy the code, paste it, customize it, own it. Done.
      </h2>
      <div className="mt-10 flex space-x-4">
        <Button size="lg" variant="default">
          Explore components
        </Button>
        <Button size="lg" variant="outline">
          <SearchIcon size={20} className="mr-2" />
          Quick search
        </Button>
      </div>
    </section>
  );
}
`,
  },
  "hooks/use-continuous-retry": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-continuous-retry")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-debounce": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-debounce")),
    code: `"use client";

import * as React from "react";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

export default function UseDebounceDemo() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchInput, setSearchInput] = React.useState<string>("");
  const debouncedValue = useDebounce<string>(searchInput, 1000);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(false);
    setSearchInput(e.target.value);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // fetch here
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    handleSubmit();
  }, [debouncedValue]);

  return (
    <div className="relative w-52">
      {isLoading ? (
        <div className="absolute left-2 flex h-full items-center">
          <Loader2Icon
            size={18}
            className="pointer-events-none animate-spin text-muted-foreground"
          />
        </div>
      ) : (
        <SearchIcon
          size={18}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        />
      )}
      <Input
        value={searchInput}
        onChange={handleChange}
        placeholder="Search items"
        className="full-w pl-8"
      />
    </div>
  );
}
`,
  },
  "hooks/use-fetch": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-fetch")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-intersection-observer": {
    component: React.lazy<React.FC>(
      () => import("~/content/hooks/use-intersection-observer")
    ),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-local-storage": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-local-storage")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-media-query": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-media-query")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-network-state": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-network-state")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-orientation": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-orientation")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-prefeerred-language": {
    component: React.lazy<React.FC>(
      () => import("~/content/hooks/use-prefeerred-language")
    ),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-previous": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-previous")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-session-storage": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-session-storage")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-visibility-change": {
    component: React.lazy<React.FC>(
      () => import("~/content/hooks/use-visibility-change")
    ),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
  "hooks/use-window-size": {
    component: React.lazy<React.FC>(() => import("~/content/hooks/use-window-size")),
    code: `export default function Demo() {
  return <div>demo</div>;
}
`,
  },
};

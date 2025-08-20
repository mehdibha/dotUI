import type { Route } from "next";
import type { useRouter } from "next/navigation";

type BlockViewRoute = `/view/${string}/${string}/${string}`;

type LegalRoute = `/terms-of-service` | `/privacy-policy`;

type DocRoute = `/docs` | `/docs/${string}` | `/docs/${string}/${string}`;

type StyleRoute =
  | `/styles/${string}/${string}`
  | `/styles/${string}/${string}/${
      | "layout"
      | "typography"
      | "components"
      | "effects"
      | "icons"}`;

declare module "react-aria-components" {
  interface RouterConfig {
    href: Route<string> | DocRoute | StyleRoute | LegalRoute | BlockViewRoute;
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

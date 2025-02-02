import { base as _base } from "@/registry/registry-base";
import { core as _core } from "@/registry/registry-core";
import { hooks as _hooks } from "@/registry/registry-hooks";
import { iconLibraries } from "@/registry/registry-icons";
import { lib as _lib } from "@/registry/registry-lib";
import { themes as _themes } from "@/registry/registry-themes";
import type { Registry } from "@/registry/types";

const base = { ..._base, type: "base" } as const;
const core = _core.map((item) => ({ ...item, type: "core" }) as const);
const hooks = _hooks.map((item) => ({ ...item, type: "hook" }) as const);
const lib = _lib.map((item) => ({ ...item, type: "lib" }) as const);
const themes = _themes.map((item) => ({ ...item, type: "theme" }) as const);
const iconLibs: Registry = Object.entries(iconLibraries).map(
  ([_, value]) =>
    ({
      name: value.name,
      type: "icon-library",
      dependencies: [value.package],
    }) as const
);

export const registry: Registry = [
  base,
  ...core,
  ...hooks,
  ...lib,
  ...themes,
  ...iconLibs,
];

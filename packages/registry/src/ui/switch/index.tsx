"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { SwitchIndicatorProps, SwitchProps, SwitchThumbProps } from "./types";

export const Switch = createDynamicComponent<SwitchProps>("switch", "Switch", Default.Switch, {});

export const SwitchIndicator = createDynamicComponent<SwitchIndicatorProps>(
	"switch",
	"SwitchIndicator",
	Default.SwitchIndicator,
	{},
);

export const SwitchThumb = createDynamicComponent<SwitchThumbProps>("switch", "SwitchThumb", Default.SwitchThumb, {});

export type { SwitchProps, SwitchIndicatorProps, SwitchThumbProps };

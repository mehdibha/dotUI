"use client";

import * as React from "react";

import { defaultVisualStateStore, type VisualStateStore } from "./visual-state-store";

interface DrawerContextValue {
	placement: "top" | "bottom" | "left" | "right";
	swipeToDismiss: boolean;
	registerDragSource: (el: HTMLElement | null) => () => void;
}

export const DrawerContext = React.createContext<DrawerContextValue | null>(null);

export function useDrawerContext() {
	const ctx = React.useContext(DrawerContext);
	if (!ctx) throw new Error("Drawer subcomponents must be used inside <Drawer>.");
	return ctx;
}

export const DrawerProviderContext = React.createContext<VisualStateStore>(
	defaultVisualStateStore,
);

export function useVisualStateStore() {
	return React.useContext(DrawerProviderContext);
}

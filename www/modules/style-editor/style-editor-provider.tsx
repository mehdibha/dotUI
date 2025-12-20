"use client";

import React from "react";

// Minimal provider - just a simple wrapper for the style editor UI shell
// No form state, no color generation, no persistence

export function StyleEditorProvider({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}

// Placeholder form wrapper - just renders children
export const StyleEditorForm = ({ children }: { children: React.ReactNode }) => {
	return <div>{children}</div>;
};

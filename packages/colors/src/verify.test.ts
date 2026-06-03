import { describe, expect, it } from "vitest";

import { wcag2 } from "./shared/color";
import { createTheme } from "./theme";
import { nudgeForTarget, pairingsFromTheme, verify, verifyTheme } from "./verify";

describe("verify", () => {
	it("levels: white-on-black is AAA; mid-on-mid fails with a suggestedFg", () => {
		const report = verify([
			{ name: "wb", fg: "#ffffff", bg: "#000000", sizeClass: "body" },
			{ name: "mid", fg: "#888888", bg: "#777777", sizeClass: "body" },
		]);
		const wb = report.results.find((r) => r.name === "wb")!;
		expect(wb.level).toBe("AAA");
		expect(wb.meets).toBe(true);
		const mid = report.results.find((r) => r.name === "mid")!;
		expect(mid.meets).toBe(false);
		expect(mid.suggestedFg).toBeTruthy();
		expect(report.passed).toBe(false);
	});

	it("size-awareness: the same pairing has a lower target for large/nonText than body", () => {
		const body = verify([{ name: "x", fg: "#767676", bg: "#fff", sizeClass: "body" }]).results[0]!;
		const large = verify([{ name: "x", fg: "#767676", bg: "#fff", sizeClass: "large" }]).results[0]!;
		expect(body.target).toBe(4.5);
		expect(large.target).toBe(3);
	});

	it("nudgeForTarget yields a foreground that clears the target", () => {
		const fixed = nudgeForTarget("#888888", "#ffffff", 4.5, "wcag2");
		expect(fixed).toBeTruthy();
		expect(wcag2(fixed!, "#ffffff")).toBeGreaterThanOrEqual(4.5);
	});

	it("verifyTheme: an oklch theme's on-* contract passes (WCAG2)", () => {
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6", success: true } });
		const report = verifyTheme(theme);
		expect(report.passed).toBe(true);
		expect(report.results.length).toBeGreaterThan(0);
	});

	it("pairingsFromTheme builds on↔step pairs across modes/palettes", () => {
		const theme = createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" } });
		// primary + neutral (derived) × light/dark × 11 steps
		expect(pairingsFromTheme(theme).length).toBe(2 * 2 * 11);
	});

	it("verifyTheme(apca) reports honest failures (floor unreachable on mid steps)", () => {
		const report = verifyTheme(createTheme({ algorithm: "oklch", palettes: { primary: "#3b82f6" } }), {
			formula: "apca",
		});
		expect(report.passed).toBe(false);
		expect(report.failures.every((f) => f.formula === "apca" && f.target === 60)).toBe(true);
	});

	it("nudgeForTarget returns null when the target is unreachable", () => {
		expect(nudgeForTarget("#888888", "#777777", 21, "wcag2")).toBe(null);
	});
});

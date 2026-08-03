"use client"

/* Shared lab-state → engine bridge for the working color frames (color-v2,
   surfaces). v1's color-ideal keeps its own frozen copy — when v2 graduates,
   the ideal file and its copy go together. */

import { useMemo } from "react"

import { toHex, toOklch, wcag2 } from "@dotui/colors"

import { resolveColorConfigCached } from "@/lib/resolve-color"
import type { ColorConfig } from "@/registry/theme"

import type { LabState } from "../data"

/** Lab state → ColorConfig, undefined at every default so the recipe stays
 *  minimal — the same absent-means-default contract the real config keeps. */
export function useLabConfig(state: LabState): ColorConfig {
  const {
    brand,
    primary,
    graySeed,
    successSeed,
    warningSeed,
    dangerSeed,
    infoSeed,
    selectionSeed,
    bgLight,
    bgDark,
    vividness,
    hueShift,
    grayTintAmount,
    preserveSeed,
    guarantees,
    borderContrast,
    border400,
    border500,
    border600,
  } = state
  return useMemo<ColorConfig>(
    () => ({
      v: 2,
      seeds: {
        accent: brand,
        neutral: graySeed || undefined,
        success: successSeed || undefined,
        warning: warningSeed || undefined,
        danger: dangerSeed || undefined,
        info: infoSeed || undefined,
        selection: selectionSeed || undefined,
      },
      background: {
        light: bgLight,
        dark: bgDark === 0 ? "oled" : bgDark,
      },
      vividness: vividness === 1 ? undefined : vividness,
      hueShift: hueShift === 1 ? undefined : hueShift,
      neutralTint: grayTintAmount === 1 ? undefined : grayTintAmount,
      preserveSeed: preserveSeed || undefined,
      guaranteePolicy:
        guarantees === "relaxed" || guarantees === "strict"
          ? guarantees
          : undefined,
      primary: primary === "accent" ? "accent" : undefined,
      borders: borderContrast
        ? {
            "*": {
              "400": border400 > 0 ? border400 : undefined,
              "500": border500 > 0 ? border500 : undefined,
              "600": border600 > 0 ? border600 : undefined,
            },
          }
        : undefined,
    }),
    [
      brand,
      primary,
      graySeed,
      successSeed,
      warningSeed,
      dangerSeed,
      infoSeed,
      selectionSeed,
      bgLight,
      bgDark,
      vividness,
      hueShift,
      grayTintAmount,
      preserveSeed,
      guarantees,
      borderContrast,
      border400,
      border500,
      border600,
    ],
  )
}

/** WCAG of the untouched borders vs the app background — the border sliders'
 *  stable zero point, measured with any border targets stripped. */
export function useBorderSeeds(config: ColorConfig) {
  return useMemo(() => {
    const { borders: _drop, ...rest } = config
    const baseline = resolveColorConfigCached(config.borders ? rest : config)
    const bg = toOklch(baseline.light.background)
    const ratio = (step: "400" | "500" | "600") => {
      const color = baseline.light.scales.neutral?.[step]
      return color ? Math.round(wcag2(toOklch(color), bg) * 100) / 100 : 1.05
    }
    return { "400": ratio("400"), "500": ratio("500"), "600": ratio("600") }
  }, [config])
}

export function cssToHex(css: string): string {
  return toHex(toOklch(css))
}

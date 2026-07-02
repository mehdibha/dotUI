'use client'

import type { ComponentType } from 'react'

import { useComponentParams } from '@/lib/styles'
import {
  LoginCentered,
  LoginMinimal,
  LoginSplit,
} from '@/registry/blocks/login'

// The "Login" block preview, rendered live in the user's design system inside the
// /create preview iframe. It reads the selected variant from the design-system
// context (set by the customizer's variant chooser) and renders the matching
// composition — so switching the variant morphs the screen in place.
const VARIANTS: Record<string, ComponentType> = {
  centered: LoginCentered,
  split: LoginSplit,
  minimal: LoginMinimal,
}

export default function BlockLoginPreview() {
  const { variant } = useComponentParams('login')
  const Variant = VARIANTS[variant ?? 'centered'] ?? LoginCentered
  return <Variant />
}

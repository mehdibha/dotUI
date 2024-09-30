"use client";

import { useConfig } from "@/hooks/use-config";
import { styles } from "@/registry/styles";

export const ComponentPreviewClient = ({ demos }: {
  demos: React.ReactNode[]
}) => {
  const config = useConfig();
  const currentStyleIndex = styles.findIndex(style => style.name=== config.style)
  return demos[currentStyleIndex]
};

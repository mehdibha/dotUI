"use client";

export const ComponentPreviewClient = ({
  demos,
}: {
  demos: React.ReactNode[];
}) => {
  // TODO: get style from config
  const currentStyleIndex = 0;
  return demos[currentStyleIndex];
};

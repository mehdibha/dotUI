"use client";

interface DemoFrameProps {
  children: React.ReactNode;
}

export const DemoFrame = ({ children }: DemoFrameProps) => {
  return <div>{children}</div>;
};

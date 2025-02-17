import { ViewTransitions } from "next-view-transitions";

export default function ThemesOldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ViewTransitions>{children}</ViewTransitions>;
}

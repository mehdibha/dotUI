import type { Metadata } from "next";

import { StylesPageNav } from "@/modules/styles/components/styles-page-nav";

const title = "Find your style or make your own.";
const description = "Try our hand-picked styles or create yours from scratch.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title,
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
};

export default function StylesLayout({ children }: LayoutProps<"/styles">) {
  return <StylesPageNav>{children}</StylesPageNav>;
}


import type { Metadata } from "next";

import { BlocksNav } from "@/modules/blocks/blocks-nav";

const title = "Blocks that don't lock you in.";
const description = "Modern UI blocks available in infinite styles.";

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

export default function BlocksLayout({ children }: LayoutProps<"/blocks">) {
  return <BlocksNav>{children}</BlocksNav>;
}


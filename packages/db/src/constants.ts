import type { z } from "zod/v4";

import type { createStyleSchema } from "./schema";

export const DEFAULT_STYLES: Omit<
  z.infer<typeof createStyleSchema>,
  "userId"
>[] = [
  {
    name: "Minimalist",
    slug: "minimalist",
    description: "A minimalist style.",
    iconLibrary: "remix",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    variants: {
      button: "basic",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Modern",
    slug: "modern",
    description: "A modern style.",
    iconLibrary: "remix",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Classic",
    slug: "classic",
    description: "A classic style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Material",
    slug: "material",
    description: "A material style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Ghibli",
    slug: "ghibli",
    description: "A Ghibli style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#f1dfbe"],
          },
          accent: {
            baseColors: ["#969A54"],
          },
        },
      },
    },
  },
  {
    name: "Brutalist",
    slug: "brutalist",
    description: "A brutalist style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Darky",
    slug: "darky",
    description: "A darky style.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Claude",
    slug: "claude",
    description: "A style inspired by Claude from Anthropic.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "A style inspired by Vercel Geist dsign system.",
    iconLibrary: "lucide",
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    theme: {
      light: {
        colors: {
          neutral: {
            baseColors: ["#fff"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
      dark: {
        colors: {
          neutral: {
            baseColors: ["#000"],
          },
          accent: {
            baseColors: ["#0091FF"],
          },
        },
      },
    },
  },
];

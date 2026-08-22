import { createFileRoute } from "@tanstack/react-router"

/** "dotUI" letterforms from public/brand/dotui-wordmark.svg (viewBox 0 0 331 100). */
const WORDMARK_PATH =
  "M160 85.96L160 85.96Q155.12 85.96 151.28 83.68Q147.44 81.40 145.24 77.08Q143.04 72.76 143.04 66.84L143.04 66.84Q143.04 60.92 145.44 56.76Q147.84 52.60 152 50.44Q156.16 48.28 161.44 48.28L161.44 48.28Q164.80 48.28 167.88 49.32Q170.96 50.36 173.04 52.52L173.04 52.52L173.04 56.04L173.04 21.88L184.16 21.88L184.16 85L172.96 85L172.96 78.20L173.84 80.60Q171.12 82.84 167.76 84.40Q164.40 85.96 160 85.96ZM163.68 76.52L163.68 76.52Q165.92 76.52 167.64 75.92Q169.36 75.32 170.68 74.16Q172 73 172.96 71.24L172.96 71.24L172.96 62.68Q172.32 60.92 171 59.68Q169.68 58.44 167.80 57.76Q165.92 57.08 163.68 57.08L163.68 57.08Q161.20 57.08 159.08 58.32Q156.96 59.56 155.68 61.72Q154.40 63.88 154.40 66.68L154.40 66.68Q154.40 69.48 155.68 71.72Q156.96 73.96 159.08 75.24Q161.20 76.52 163.68 76.52ZM188.96 67.08L188.96 67.08Q188.96 61.72 191.48 57.48Q194.00 53.24 198.56 50.80Q203.12 48.36 209.04 48.36L209.04 48.36Q215.04 48.36 219.44 50.80Q223.84 53.24 226.20 57.48Q228.56 61.72 228.56 67.08L228.56 67.08Q228.56 72.44 226.20 76.72Q223.84 81 219.44 83.48Q215.04 85.96 208.88 85.96L208.88 85.96Q203.12 85.96 198.60 83.72Q194.08 81.48 191.52 77.24Q188.96 73 188.96 67.08ZM200.24 67.16L200.24 67.16Q200.24 69.88 201.36 72.08Q202.48 74.28 204.40 75.56Q206.32 76.84 208.72 76.84L208.72 76.84Q211.36 76.84 213.28 75.56Q215.20 74.28 216.24 72.08Q217.28 69.88 217.28 67.16L217.28 67.16Q217.28 64.36 216.24 62.20Q215.20 60.04 213.28 58.76Q211.36 57.48 208.72 57.48L208.72 57.48Q206.32 57.48 204.40 58.76Q202.48 60.04 201.36 62.20Q200.24 64.36 200.24 67.16ZM236.64 49.88L236.64 34.68L247.84 34.68L247.84 49.88L256.32 49.88L256.32 58.60L247.84 58.60L247.84 85L236.64 85L236.64 58.60L231.20 58.60L231.20 49.88L236.64 49.88ZM273.12 26.12L273.12 63.24Q273.12 66.04 274.80 68.60Q276.48 71.16 279.24 72.76Q282 74.36 285.28 74.36L285.28 74.36Q288.88 74.36 291.68 72.76Q294.48 71.16 296.12 68.60Q297.76 66.04 297.76 63.24L297.76 63.24L297.76 26.12L309.20 26.12L309.20 63.48Q309.20 69.96 306 74.96Q302.80 79.96 297.36 82.80Q291.92 85.64 285.28 85.64L285.28 85.64L285.28 85.64Q278.72 85.64 273.32 82.80Q267.92 79.96 264.72 74.96Q261.52 69.96 261.52 63.48L261.52 63.48L261.52 26.12L273.12 26.12ZM319.20 85L319.20 26.12L330.80 26.12L330.80 85L319.20 85Z"

const BG = "#f2efec"
const ESPRESSO = "#381e1e"

function Wordmark({ size }: { size: number }) {
  return (
    <svg
      width={size * 3.31}
      height={size}
      viewBox="0 0 331 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="12" ry="12" fill={ESPRESSO} />
      <circle cx="75" cy="75" r="11" fill={BG} />
      <path d={WORDMARK_PATH} fill={ESPRESSO} />
    </svg>
  )
}

/** Docs titles top out around 20 chars; the ladder covers anything longer. */
function titleSize(title: string) {
  if (title.length <= 20) return 78
  if (title.length <= 34) return 66
  return 56
}

async function loadFonts(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("@/assets/fonts/geist-regular-otf.json").then(
      (mod) => mod.default || mod,
    ),
    import("@/assets/fonts/geistmono-regular-otf.json").then(
      (mod) => mod.default || mod,
    ),
    import("@/assets/fonts/geist-semibold-otf.json").then(
      (mod) => mod.default || mod,
    ),
  ])

  return [
    {
      name: "Geist",
      data: Buffer.from(normal, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist Mono",
      data: Buffer.from(mono, "base64"),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: Buffer.from(semibold, "base64"),
      weight: 600 as const,
      style: "normal" as const,
    },
  ]
}

export const Route = createFileRoute("/og")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { ImageResponse } = await import("@vercel/og")
        const { searchParams } = new URL(request.url)
        const title = searchParams.get("title") ?? ""
        const description = searchParams.get("description")
        const eyebrow = searchParams.get("eyebrow")

        const fonts = await loadFonts()

        return new ImageResponse(
          <div
            tw="flex flex-col w-full h-full"
            style={{ backgroundColor: BG, fontFamily: "Geist" }}
          >
            <div tw="flex flex-col flex-1 px-16 pt-14">
              <Wordmark size={42} />

              {/* Fixed offset, not centred: the title lands on the same
                  baseline on every card, so the docs set reads as one system
                  however long the description runs. */}
              <div tw="flex flex-col" style={{ marginTop: 152 }}>
                {eyebrow ? (
                  <div
                    tw="flex mb-6"
                    style={{
                      color: "#8c7a72",
                      fontFamily: "Geist Mono",
                      fontSize: 22,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {eyebrow}
                  </div>
                ) : null}

                <div
                  style={{
                    color: "#231613",
                    fontWeight: 600,
                    fontSize: titleSize(title),
                    letterSpacing: "-0.045em",
                    lineHeight: 1.06,
                    maxWidth: 900,
                  }}
                >
                  {title}
                </div>

                {description ? (
                  <div
                    tw="mt-6"
                    style={{
                      color: "#6b5a54",
                      fontSize: 30,
                      lineHeight: 1.4,
                      maxWidth: 860,
                      // Descriptions are capped at 148 chars upstream, which
                      // runs to 3 lines; clamp so a longer one can't reach the
                      // bottom rule. Satori reads `lineClamp` only on a block.
                      display: "block",
                      lineClamp: 3,
                    }}
                  >
                    {description}
                  </div>
                ) : null}
              </div>
            </div>

            <div tw="h-4" style={{ backgroundColor: ESPRESSO }} />
          </div>,
          {
            width: 1200,
            height: 630,
            fonts,
            headers: {
              "Cache-Control":
                "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
            },
          },
        )
      },
    },
  },
})

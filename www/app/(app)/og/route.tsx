import { ImageResponse } from "next/og";

async function loadAssets(): Promise<
  { name: string; data: Buffer; weight: 400 | 600; style: "normal" }[]
> {
  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

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
  ];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const description = searchParams.get("description");

  const [fonts] = await Promise.all([loadAssets()]);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col h-full w-full bg-black text-white "
        style={{ fontFamily: "Geist Sans" }}
      >
        <div tw="flex h-full w-full flex-1">
          <div
            style={
              {
                backgroundImage:
                  "repeating-linear-gradient(315deg, #685c5c 0, #685c5c 1px, transparent 0, transparent 50%)",
                backgroundSize: "10px 10px",
              } as React.CSSProperties
            }
            tw="h-full w-8 border-r border-l border-[#3f3838]"
          />
          <div tw="flex-1 flex flex-col justify-center p-12 pt-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="50"
              height="50"
            >
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                rx="12"
                ry="12"
                fill="white"
              />
              <circle cx="75" cy="75" r="11" fill="#381e1e" />
            </svg>
            <div tw="flex flex-col justify-center flex-1">
              <div
                tw="tracking-tight leading-[1.1] text-center"
                style={{
                  textWrap: "balance",
                  fontWeight: 600,
                  fontSize: title && title.length > 20 ? 64 : 80,
                  letterSpacing: "-0.04em",
                }}
              >
                {title}
              </div>
              <div
                tw="text-[40px] leading-[1.5] text-stone-400 mt-4"
                style={{
                  fontWeight: 500,
                  textWrap: "balance",
                }}
              >
                {description}
              </div>
            </div>
          </div>
          <div
            style={
              {
                backgroundImage:
                  "repeating-linear-gradient(315deg, #685c5c 0, #685c5c 1px, transparent 0, transparent 50%)",
                backgroundSize: "10px 10px",
              } as React.CSSProperties
            }
            tw="h-full w-8 border-r border-l border-[#3f3838]"
          />
        </div>
        <div tw="border-t border-[#3f3838] h-32"></div>
      </div>
    ),
    {
      width: 1200,
      height: 628,
      fonts,
    },
  );
}

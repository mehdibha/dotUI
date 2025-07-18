import { restoreStyleDefinitionDefaults } from "@dotui/style-engine";
import { StyleProvider } from "@dotui/ui";
import { Button } from "@dotui/ui/components/button";

export default function InternalPage() {
  const style = restoreStyleDefinitionDefaults({
    name: "Minimalist",
    slug: "minimalist",
    theme: {
      colors: {
        modes: {
          light: {
            scales: {
              neutral: {
                colorKeys: ["#111184"],
              },
            },
          },
        },
      },
    },
    variants: {
      buttons: "brutalist",
    },
  });
  return (
    <div className="flex h-screen items-center justify-center">
      <StyleProvider
        mode="light"
        style={style}
        className="flex size-100 items-center justify-center rounded-md border"
      >
        <Button>button</Button>
      </StyleProvider>
    </div>
  );
}

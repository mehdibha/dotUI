import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold ">Components</h1>
      <p className="mt-2 text-muted-foreground">Copy and paste components for your React app</p>
      <div className="mt-6 flex gap-4">
        {[
          { label: "Marketing", value: "marketing" },
          { label: "Application UI", value: "application-ui" },
          { label: "eCommerce", value: "ecommerce" },
        ].map((category) => (
          <div
            key={category.value}
            className="flex cursor-pointer items-center justify-center rounded bg-card px-4 py-1 duration-150 hover:bg-card/50"
          >
            <p>{category.label}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link href="#" className="inline-flex items-center hover:underline">
          <ArrowRightIcon size={18} className="mr-2" />
          See all categories
        </Link>
      </div>
      <div className="mt-16 grid grid-cols-3 gap-4">
        {[
          {
            label: "Spotlight card",
            description:
              "A spotlight effect that follows the cursor and highlights contents on element hover.",
          },
          {
            label: "Star Grid",
            description:
              "A dotted grid of glowing stars with a featured animated element.",
          },
          {
            label: "Star Grid",
            description:
              "A dotted grid of glowing stars with a featured animated element.A dotted grid of glowing stars with a featured animated element.A dotted grid of glowing stars with a featured animated element.A dotted grid of glowing stars with a featured animated element.",
          },
        ].map((component, index) => (
          <div key={index} className="rounded-md bg-card p-2 hover:bg-card/70 transition-colors duration-100 cursor-pointer">
            <div className="aspect-video rounded-sm bg-background"></div>
            <div className="p-3">
              <p className="mt- text-lg font-semibold">{component.label}</p>
              <p className="text-muted-foreground text-sm mt-1">{component.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

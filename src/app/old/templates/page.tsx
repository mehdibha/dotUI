import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold ">Templates</h1>
      <p className="mt-2 text-muted-foreground">
        Copy and paste pages for your React app
      </p>
      <div className="mt-6 gap-4 flex">
        {[
          { label: "Marketing", value: "marketing" },
          { label: "Application", value: "application-ui" },
          { label: "eCommerce", value: "ecommerce" },
        ].map((category) => (
          <div
            key={category.value}
            className="flex cursor-pointer items-center justify-center rounded bg-card px-4 py-1 duration-150 hover:bg-card/50 focus-ring"
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
      <div className="mt-16 grid grid-cols-4 gap-4">
        {[
          {
            label: "Pricing page",
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
              "A dotted grid of glowing stars with a featured animated element.",
          },
        ].map((component, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-md bg-card p-2 transition-colors duration-100 hover:bg-card/70"
          >
            <div className="aspect-[9/11] rounded-sm bg-background"></div>
            <div className="p-3">
              <p className="mt- text-lg font-semibold">{component.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {component.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

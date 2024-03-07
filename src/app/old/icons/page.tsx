import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold ">Icons</h1>
      <p className="mt-2 text-muted-foreground">
        Copy and paste icons for your React app
      </p>
      <div className="mt-6 flex gap-4">
        {[
          { label: "Logos", value: "logos" },
          { label: "Lucide", value: "Lucide" },
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
      <div className="mt-16 grid grid-cols-8 gap-4">
        {[
          {
            label: "Google",
          },
          {
            label: "X",
          },
          {
            label: "Sony",
          },
        ].map((component, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-md bg-card p-2 transition-colors duration-100 hover:bg-card/70"
          >
            <div className="aspect-square rounded-sm bg-background"></div>
            <div className="p-1 mt-1">
              <p className="font-semibold">{component.label}</p>
              {/* <p className="mt-1 text-sm text-muted-foreground">
                {component.description}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

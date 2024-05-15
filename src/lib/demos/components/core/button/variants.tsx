import { Button } from "@/lib/components/core/default/button";

const variants = ["fill", "outline", "ghost"] as const;
const types = ["neutral", "primary", "success", "warning", "danger"] as const;

export default function ButtonDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-2">
      {types.map((type) => (
        <div key={type} className="flex flex-col space-y-2">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} type={type}>
              {type}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

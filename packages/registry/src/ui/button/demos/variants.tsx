import { Button } from "@dotui/registry/ui/button";

const variants = [
  "default",
  "primary",
  "quiet",
  "success",
  "warning",
  "danger",
] as const;

export default function Demo() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  );
}

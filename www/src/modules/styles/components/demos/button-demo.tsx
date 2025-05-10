import { ArrowRightIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      {([{ label: "Medium", size: "md" }] as const).map(({ size }) => (
        <div key={size} className="flex flex-row flex-wrap items-center gap-2">
          <Button size={size}>Default</Button>
          <Button variant="outline" size={size}>
            Outline
          </Button>
          <Button variant="accent" size={size}>
            Accent
          </Button>
          <Button variant="quiet" size={size}>
            Quiet
          </Button>
          <Button variant="primary" size={size}>
            Primary
          </Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success" size={size}>
            Success
          </Button>
          <Button variant="warning" size={size}>
            Warning
          </Button>
          <Button prefix={<SendIcon />} size={size}>
            Send
          </Button>
          <Button suffix={<ArrowRightIcon />} size={size}>
            Learn More
          </Button>
          <Button isDisabled size={size}>
            Disabled
          </Button>
          <Button isPending size={size}>
            Pending
          </Button>
        </div>
      ))}
    </div>
  );
}

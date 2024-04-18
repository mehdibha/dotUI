import { DollarSignIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { Input } from "@/lib/components/core/default/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/lib/components/core/default/tooltip";

export default function InputPrefixAndSuffixDemo() {
  return (
    <div className="w-full space-y-2">
      <Input type="number" prefix={<DollarSignIcon />} />
      <Input prefix={<span>http://</span>} />
      <Input suffix={<span>@rcopy.dev</span>} />
      <Input
        suffix={
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" shape="circle" size="sm" className="h-6 w-6">
                <XCircleIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Clear input
            </TooltipContent>
          </Tooltip>
        }
      />
    </div>
  );
}

import { DollarSignIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { TextField } from "@/lib/components/core/default/text-field";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function InputPrefixAndSuffixDemo() {
  return (
    <div className="w-full space-y-2">
      <TextField htmlType="number" prefix={<DollarSignIcon />} />
      <TextField prefix={<span>http://</span>} />
      <TextField suffix={<span>@rcopy.dev</span>} />
      <TextField
        suffix={
          <Tooltip content="Clear input" placement="bottom" className="text-xs">
            <Button variant="ghost" shape="circle" size="sm" className="h-6 w-6">
              <XCircleIcon />
            </Button>
          </Tooltip>
        }
      />
    </div>
  );
}

import { XCircleIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { TextField } from "@/lib/components/core/default/text-field";
import { Tooltip } from "@/lib/components/core/default/tooltip";

export default function Demo() {
  return (
    <div className="w-full space-y-2">
      <TextField prefix={<span>http://</span>} />
      <TextField suffix={<span>@rcopy.dev</span>} />
      <TextField
        defaultValue="Hello world!"
        suffix={
          <Tooltip content="Clear input" placement="bottom" className="text-xs">
            <Button variant="quiet" shape="square" size="sm" className="size-6">
              <XCircleIcon />
            </Button>
          </Tooltip>
        }
      />
    </div>
  );
}

import { Button } from "@dotui/registry/ui/button";
import { Tooltip, TooltipContent } from "@dotui/registry/ui/tooltip";

export default function Demo() {
  return (
    <div className="grid gap-2 [grid-template-areas:'top-left_top_top-right'_'left-top_top_right-top'_'left_._right'_'left-bottom_._right-bottom'_'bottom-left_bottom_bottom-right']">
      {(
        [
          "top left",
          "top",
          "top right",
          "left",
          "left top",
          "left bottom",
          "right",
          "right top",
          "right bottom",
          "bottom left",
          "bottom",
          "bottom right",
        ] as const
      ).map((placement) => (
        <Tooltip key={placement}>
          <Button style={{ gridArea: placement.replace(" ", "-") }}>
            {placement}
          </Button>
          <TooltipContent placement={placement}>Edit name</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

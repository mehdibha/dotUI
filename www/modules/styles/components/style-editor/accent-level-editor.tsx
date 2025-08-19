import { FormControl } from "@dotui/ui/components/form";
import { Skeleton } from "@dotui/ui/components/skeleton";
import { Slider } from "@dotui/ui/components/slider";

import { useStyleForm } from "@/modules/styles/providers/style-editor-provider";

export const AccentLevelEditor = () => {
  const { form, isLoading } = useStyleForm();
  
  return (
    <FormControl
      control={form.control}
      name="theme.colors.accentLevel"
      render={(props) => (
        <Skeleton show={isLoading}>
          <Slider
            {...props}
            label="Accent"
            minValue={0}
            maxValue={3}
            step={1}
            className="w-full"
          />
        </Skeleton>
      )}
    />
  );
};

import { registryUi } from "@dotui/registry/ui/registry";

export function getComponentVariants(
  componentName: string,
): { name: string; label: string }[] {
  return registryUi
    .filter((item) => item.name.startsWith(`${componentName}:`))
    .map((item) => {
      const variant = item.name.split(":")[1];
      if (!variant) {
        return null;
      }
      return {
        name: variant,
        label: variant.charAt(0).toUpperCase() + variant.slice(1),
      };
    })
    .filter((variant) => variant !== null);
}

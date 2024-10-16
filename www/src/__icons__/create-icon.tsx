import { useConfig } from "@/hooks/use-config";

export const createIcon = (icons: {
  lucide: React.ElementType;
  remix: React.ElementType;
}) => {
  const Icon = (props: { className?: string }) => {
    const { iconLibrary } = useConfig();
    const IconComponent = icons[iconLibrary as keyof typeof icons];
    if (!IconComponent) {
      return null;
    }
    return <IconComponent {...props} />;
  };
  return Icon;
};

import { useConfig } from "@/hooks/use-config";

export const createIcon = (icons: {
  lucide: React.ElementType;
  remix: React.ElementType;
}) => {
  const Icon = (props: { className?: string }) => {
    const { iconLibrary } = useConfig();
    const Icon = icons[iconLibrary];
    if (!Icon) {
      return null;
    }
    return <Icon {...props} />;
  };
  return Icon;
};

import { usePathname } from "next/navigation";

export const useStyleEditorParams = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const username = segments[2] ?? "";
  const style = segments[3] ?? "";
  const slug = `${username}/${style}`;

  return { username, style, slug };
};

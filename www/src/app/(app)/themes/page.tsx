import { ThemesExplorer } from "@/modules/themes/components/themes-explorer";

export default function ThemesPage() {
  return (
    <div>
      <h2 className="w-fit text-2xl font-semibold [view-transition-name:themes-title]">
        Themes
      </h2>
      <p className="text-fg-muted mt-2 text-base">
        A theme provide a complete design system with carefully crafted colors,
        typography, and chosen components.
      </p>
      <ThemesExplorer />
    </div>
  );
}

import { ThemesExplorer } from "@/modules/themes/components/themes-explorer";

export default function ThemesPage() {
  return (
    <div className="pb-32 pt-6">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">Themes</h2>
      <p className="text-fg-muted mt-2 text-base">
        A theme provide a complete design system with its own colors, fonts,
        icons, layout, and components.
      </p>
      <ThemesExplorer />
    </div>
  );
}

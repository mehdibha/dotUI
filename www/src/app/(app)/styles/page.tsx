import { StylesExplorer } from "@/modules/styles/components/styles-explorer";

export default function ThemesPage() {
  return (
    <div className="container max-w-4xl pb-32 pt-16">
      <h2 className="w-fit text-3xl font-semibold tracking-tight">Styles</h2>
      <p className="text-fg-muted mt-2 text-base">
        A style provide a complete design system with its own colors, fonts,
        icons, layout, and components.
      </p>
      <StylesExplorer className="mt-6" />
    </div>
  );
}

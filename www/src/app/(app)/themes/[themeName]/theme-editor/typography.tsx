import { FontSelector } from "@/modules/themes/components/font-selector";

export function ThemeTypography() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 pt-1">
        <FontSelector label="Heading" font={null} onFontChange={() => {}} />
        <FontSelector label="Body" font={null} onFontChange={() => {}} />
      </div>
      <div className="font-heading mt-3 space-y-1 font-bold tracking-tight">
        <p className="text-5xl">Heading 5XL</p>
        <p className="text-4xl">Heading 4XL</p>
        <p className="text-3xl">Heading 3XL</p>
        <p className="text-2xl">Heading 2XL</p>
        <p className="text-xl">Heading XL</p>
        <p className="text-lg">Heading LG</p>
      </div>
      <div className="font-body mt-4 space-y-0.5 tracking-tight">
        <p className="text-xl">This is body content XL</p>
        <p className="text-lg">This is body content LG</p>
        <p className="text-base">This is body content base</p>
        <p className="text-sm">This is body content sm</p>
      </div>
    </div>
  );
}

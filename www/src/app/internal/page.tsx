// "use client";
import React from "react";

// import { FontSelector } from "@/modules/themes/components/font-selector";

export default function Demo() {
  // const [font, setFont] = React.useState<string | null>(null);

  // const content = variableFonts
  //   .filter((elem) => elem.subsets.includes("latin"))
  //   .filter((elem) => elem.variants.includes("regular"))
  //   .filter((elem) => elem.category === "handwriting")
  //   .map((elem) => elem.family);

  // const rawContent = JSON.stringify(content, null, 2);

  // const allCategories = variableFonts.map((elem) => elem.category)
  // const uniqueCategories = [...new Set(allCategories)]
  // console.log(uniqueCategories)

  // React.useEffect(() => {
  //   // copy to clipboard
  //   navigator.clipboard.writeText(rawContent);
  // }, [rawContent]);

  return (
    <div className="container max-w-xs py-40">
      {/* <FontSelector label="Body" font={font} onFontChange={setFont} /> */}
    </div>
  );
}

"use client";

import React from "react";

import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";

import { StyleEditorSection } from "@/modules/styles/components/style-editor/section";
import { ColorTokens } from "@/modules/styles/components/style-editor/color-tokens";

export function TokensSection() {
  return (
    <StyleEditorSection title="Tokens">
      <div className="mt-3 space-y-4">
        {[
          { name: "Backgrounds", category: "background" as const },
          { name: "Foregrounds", category: "foreground" as const },
          { name: "Borders", category: "border" as const },
        ].map(({ name, category }) => (
          <div key={name}>
            <h3 className="text-sm font-medium">{name}</h3>
            <ColorTokens
              tokenIds={COLOR_TOKENS.filter((tk) =>
                tk.categories?.some((cat) => cat === category),
              ).map((tk) => tk.name)}
            />
          </div>
        ))}
      </div>
    </StyleEditorSection>
  );
}


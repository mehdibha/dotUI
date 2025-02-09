"use client";

import React from "react";
import { dotUIThemes } from "@/lib/themes";
import { useThemes } from "@/hooks/use-themes";
import { Alert } from "@/components/core/alert";
import { Dialog, DialogRoot } from "@/components/core/dialog";
import { Radio, RadioGroup } from "@/components/core/radio-group";

export const ExploreThemesDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { themes: userThemes, currentThemeId, setCurrentThemeId } = useThemes();
  return (
    <DialogRoot>
      {children}
      <Dialog type="drawer" className="max-w-(--breakpoint-xl) py-8! container">
        {({ close }) => (
          <>
            <h2 className="text-lg font-bold">Themes</h2>
            <p className="text-fg-muted text-sm">
              Curated collection of handcrafted themes, inspired by leading
              brands and designed to elevate your project&apos;s visual
              identity.
            </p>
            <RadioGroup
              value={currentThemeId}
              onChange={(value) => {
                setCurrentThemeId(value);
                close();
              }}
              variant="card"
              orientation="horizontal"
              className="mt-4 gap-2"
            >
              {dotUIThemes.map((theme, index) => (
                <Radio key={index} value={theme.id}>
                  <div className="p-0">
                    <p className="font-semibold">{theme.name}</p>
                    <p className="text-fg-muted text-sm">
                      Lorem ipsum dolor sit amet...
                    </p>
                  </div>
                  <div className="mt-2 grid grid-cols-4 overflow-hidden rounded">
                    {[
                      theme.colors[theme.defaultMode].neutral.shades[0],
                      theme.colors[theme.defaultMode].neutral.shades[1],
                      theme.colors[theme.defaultMode].accent.shades[3],
                      theme.colors[theme.defaultMode].accent.shades[4],
                    ].map((color, index) => (
                      <div
                        key={index}
                        className="h-5"
                        style={{
                          backgroundColor: color,
                        }}
                      />
                    ))}
                  </div>
                </Radio>
              ))}
            </RadioGroup>
            <h2 className="mt-6 text-lg font-bold">Your themes</h2>
            <p className="text-fg-muted text-sm">
              Custom themes you create will appear here.
            </p>
            {userThemes.length > 0 ? (
              <RadioGroup
                value={currentThemeId}
                onChange={(value) => {
                  setCurrentThemeId(value);
                  close();
                }}
                variant="card"
                orientation="horizontal"
                className="mt-4 gap-2"
              >
                {userThemes.map((theme, index) => (
                  <Radio key={index} value={theme.id}>
                    <div className="p-0">
                      <p className="font-semibold">{theme.name}</p>
                      <p className="text-fg-muted text-sm">
                        Lorem ipsum dolor sit amet...
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-4 overflow-hidden rounded">
                      {[
                        theme.colors[theme.defaultMode].neutral.shades[0],
                        theme.colors[theme.defaultMode].neutral.shades[1],
                        theme.colors[theme.defaultMode].accent.shades[3],
                        theme.colors[theme.defaultMode].accent.shades[4],
                      ].map((color, index) => (
                        <div
                          key={index}
                          className="h-5"
                          style={{
                            backgroundColor: color,
                          }}
                        />
                      ))}
                    </div>
                  </Radio>
                ))}
              </RadioGroup>
            ) : (
              <div className="mt-4 flex">
                <Alert variant="info" className="text-fg-muted">
                  No themes created yet. Create your first theme to get started.
                </Alert>
              </div>
            )}
          </>
        )}
      </Dialog>
    </DialogRoot>
  );
};

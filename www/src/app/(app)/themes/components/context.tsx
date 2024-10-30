"use client";

import React, { createContext } from "react";

interface Context {
  preview: string | null;
  setPreview: (preview: string | null) => void;
}

const PreviewContext = createContext<Context>({
  preview: null,
  setPreview: () => {},
});

export const usePreview = () => {
  const context = React.useContext(PreviewContext);
  return context;
};

export const PreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  return (
    <PreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

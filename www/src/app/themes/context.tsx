"use client";

import React, { createContext } from "react";

interface Context {
  preview: string;
  setPreview: (preview: string) => void;
}

const PreviewContext = createContext<Context>({
  preview: "",
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
  const [preview, setPreview] = React.useState<string>("color-neutral");
  return (
    <PreviewContext.Provider value={{ preview, setPreview }}>
      {children}
    </PreviewContext.Provider>
  );
};

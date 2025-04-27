import React from "react";

export const ThemeEditorContext = React.createContext<{
  isLoading: boolean;
  isEditMode: boolean;
}>({
  isLoading: false,
  isEditMode: false,
});

export const useThemeEditorContext = () => React.useContext(ThemeEditorContext);

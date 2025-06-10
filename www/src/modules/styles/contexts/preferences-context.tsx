import react from "react";
import { DEFAULT_PREFERENCES } from "@/modules/styles/constants/defaults";
import type { Preferences } from "@/modules/styles/types";

const PreferencesContext = react.createContext<{
  preferences: Preferences;
}>({ preferences: DEFAULT_PREFERENCES });

export const PreferencesProvider = ({
  preferences,
  children,
}: {
  preferences: Preferences;
  children: React.ReactNode;
}) => {
  return (
    <PreferencesContext.Provider value={{ preferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = react.useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesContext");
  return ctx.preferences;
};

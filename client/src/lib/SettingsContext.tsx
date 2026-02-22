import React, { createContext, useContext, useEffect, useState } from "react";

type FontStyle = "sans" | "serif" | "mono";
type Theme = "light" | "dark";

interface SettingsContextType {
  fontStyle: FontStyle;
  setFontStyle: (font: FontStyle) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
    return (localStorage.getItem("minimal-font") as FontStyle) || "sans";
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("minimal-theme") as Theme) || "light";
  });

  useEffect(() => {
    localStorage.setItem("minimal-font", fontStyle);
    document.body.className = `font-${fontStyle}-style`;
  }, [fontStyle]);

  useEffect(() => {
    localStorage.setItem("minimal-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ fontStyle, setFontStyle, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
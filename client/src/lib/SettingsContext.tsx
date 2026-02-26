import React, { createContext, useContext, useEffect, useState } from "react";

type FontStyle = "sans" | "serif" | "mono";
type Theme = "light" | "dark";

interface SettingsContextType {
  fontStyle: FontStyle;
  setFontStyle: (font: FontStyle) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const FONT_STYLES: FontStyle[] = ["sans", "serif", "mono"];
const THEMES: Theme[] = ["light", "dark"];

const isFontStyle = (value: string | null): value is FontStyle => {
  return value !== null && FONT_STYLES.includes(value as FontStyle);
};

const isTheme = (value: string | null): value is Theme => {
  return value !== null && THEMES.includes(value as Theme);
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontStyle, setFontStyle] = useState<FontStyle>(() => {
    const saved = localStorage.getItem("minimal-font");
    return isFontStyle(saved) ? saved : "sans";
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("minimal-theme");
    return isTheme(saved) ? saved : "light";
  });

  useEffect(() => {
    localStorage.setItem("minimal-font", fontStyle);

    document.body.classList.remove("font-sans-style", "font-serif-style", "font-mono-style");
    document.body.classList.add(`font-${fontStyle}-style`);
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

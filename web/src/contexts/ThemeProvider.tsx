import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "infectio-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const readStoredTheme = (): Theme => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
};

const applyClass = (resolved: ResolvedTheme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
};

const computeResolved = (theme: Theme): ResolvedTheme =>
  theme === "system" ? getSystemTheme() : theme;

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    computeResolved(readStoredTheme())
  );

  useEffect(() => {
    const resolved = computeResolved(theme);
    setResolvedTheme(resolved);
    applyClass(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next: ResolvedTheme = media.matches ? "dark" : "light";
      setResolvedTheme(next);
      applyClass(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (next: Theme) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

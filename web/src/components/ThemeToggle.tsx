import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label =
    theme === "light"
      ? "Switch to dark theme"
      : theme === "dark"
        ? "Switch to system theme"
        : "Switch to light theme";

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

export default ThemeToggle;

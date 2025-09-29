// Theme Toggle Component - Single Responsibility
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { useThemeStore } from "../../store/useThemeStore";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="btn-ghost"
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
};
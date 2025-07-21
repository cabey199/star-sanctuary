import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export default function ThemeToggle({
  className = "",
  size = "default",
  variant = "outline",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-200 border-2 ${
        theme === "dark"
          ? "border-yellow-400 bg-yellow-900/20 text-yellow-100 hover:bg-yellow-800/30"
          : "border-blue-400 bg-blue-900/20 text-blue-100 hover:bg-blue-800/30"
      } ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <>
          <Moon className="w-4 h-4 mr-2" />
          Dark Mode
        </>
      ) : (
        <>
          <Sun className="w-4 h-4 mr-2" />
          Light Mode
        </>
      )}
    </Button>
  );
}

// Compact version for smaller spaces
export function ThemeToggleCompact({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`w-9 h-9 p-0 transition-all duration-200 border-2 ${
        theme === "dark"
          ? "border-yellow-400 bg-yellow-900/20 text-yellow-100 hover:bg-yellow-800/30"
          : "border-blue-400 bg-blue-900/20 text-blue-100 hover:bg-blue-800/30"
      } ${className}`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  );
}

import { Button } from "./Button";
import { useTheme } from "./ThemeContext";

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="secondary" onClick={toggleTheme}>
      Toggle theme ({theme})
    </Button>
  )
}
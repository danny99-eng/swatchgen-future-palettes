import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 border border-primary/30 dark:border-primary/50 backdrop-blur-sm overflow-hidden group transition-all duration-500 hover:scale-110 hover:shadow-[0_0_30px_hsl(var(--glow-primary))] theme-toggle-button"
      aria-label="Toggle theme"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 animate-gradient-shift" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Toggle circle */}
      <div
        className={`relative z-10 w-6 h-6 rounded-full bg-gradient-to-br from-white to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg flex items-center justify-center transition-transform duration-500 ease-out ${
          isDark ? 'translate-x-[32px]' : 'translate-x-1'
        }`}
      >
        {/* Icon container with rotation */}
        <div
          className={`flex items-center justify-center transition-transform duration-500 ${
            isDark ? 'rotate-180' : 'rotate-0'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 text-primary" fill="currentColor" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" />
          )}
        </div>

        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm" />
      </div>

      {/* Stars effect for dark mode */}
      {isDark && (
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-star-twinkle"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse-ring" />
    </button>
  );
};

export default ThemeToggle;


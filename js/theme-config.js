/**
 * TAILWINDCSS THEME CONFIGURATION
 * =================================
 * Centralized TailwindCSS configuration that matches the CSS theme variables.
 * 
 * To change the theme colors, update:
 * 1. css/theme.css (CSS variables)
 * 2. This file (TailwindCSS config)
 * 
 * Usage: Include this script before TailwindCSS CDN in your HTML files.
 */

window.tailwindConfig = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Space Grotesk', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        accent: '#06b6d4',   // Must match --accent in theme.css
        accent2: '#6366f1',  // Must match --accent2 in theme.css
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '16px',
      },
    },
  },
};

// Apply config if TailwindCSS is loaded
if (typeof tailwind !== 'undefined' && tailwind.config) {
  tailwind.config(window.tailwindConfig);
}

// Update TailwindCSS config when theme changes
window.addEventListener('themechange', function(e) {
  const themeColors = {
    ocean: { accent: '#06b6d4', accent2: '#6366f1' },
    sunrise: { accent: '#0891b2', accent2: '#4f46e5' },
    midnight: { accent: '#3b82f6', accent2: '#2563eb' },
    royal: { accent: '#a855f7', accent2: '#9333ea' },
    forest: { accent: '#10b981', accent2: '#059669' },
    sunset: { accent: '#f97316', accent2: '#ea580c' },
    blossom: { accent: '#ec4899', accent2: '#db2777' }
  };
  
  const colors = themeColors[e.detail.theme] || themeColors.ocean;
  if (window.tailwindConfig && window.tailwindConfig.theme) {
    window.tailwindConfig.theme.extend.colors.accent = colors.accent;
    window.tailwindConfig.theme.extend.colors.accent2 = colors.accent2;
  }
  
  // Re-apply TailwindCSS config
  if (typeof tailwind !== 'undefined' && tailwind.config) {
    tailwind.config(window.tailwindConfig);
  }
});

